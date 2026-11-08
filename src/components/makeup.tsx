'use client';

import Link from 'next/link';
import { SignOutButton } from '@/components/sign-out';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, ClipboardList, Download, FileText } from 'lucide-react';
import { api, downloadApiFile, items, unwrap, type Envelope } from '@/lib/api';
import { formatDateTime } from '@/lib/date';
import { RowListSkeleton } from '@/components/loading';

type MakeupStatus = 'pending' | 'approved' | 'rejected';
type MakeupRequest = {
  id: string | number;
  visitor_name: string;
  host_club: string;
  request_date: string;
  request_date_display?: string;
  status: MakeupStatus;
  created_at: string;
  rejection_note?: string | null;
  president_name?: string | null;
  secretary_name?: string | null;
  card_available?: boolean;
};
type ReviewMode = 'approve' | 'reject' | null;

function dateLabel(request: MakeupRequest) {
  return request.request_date_display || request.request_date || '—';
}

function StatusBadge({ status }: { status: MakeupStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`makeup-status status-${status}`}>{label}</span>;
}

export function MakeupCardRequestForm() {
  const [visitorName, setVisitorName] = useState('');
  const [hostClub, setHostClub] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<MakeupRequest | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await api<Envelope<MakeupRequest>>('/api/makeup-requests', {
        method: 'POST',
        body: JSON.stringify({ visitor_name: visitorName.trim(), host_club: hostClub.trim() }),
      });
      setSubmitted(unwrap(result));
    } catch (cause: any) {
      setError(cause.message || 'We could not submit your request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <main className="page makeup-page">
        <section className="makeup-confirmation" role="status">
          <span className="makeup-confirmation-icon"><BadgeCheck size={32} /></span>
          <span className="eyebrow">REQUEST RECEIVED</span>
          <h1>Thank you, {submitted.visitor_name}.</h1>
          <p>Your make-up card request has been submitted to Rotary E-Club of Greater Nigeria for review.</p>
          <div className="makeup-reference-grid">
            <div><small>REQUEST REFERENCE</small><strong>{submitted.id}</strong></div>
            <div><small>SUBMISSION DATE</small><strong>{dateLabel(submitted)}</strong></div>
          </div>
          <p className="makeup-confirmation-note">An administrator will review your request. This page does not provide request status tracking.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page makeup-page">
      <div className="makeup-page-heading">
        <span className="eyebrow">VISITING ROTARIAN</span>
        <h1>Request a make-up card</h1>
        <p>Share your details below and our club administrator will review your visit.</p>
      </div>
      <form className="form makeup-request-form" onSubmit={submit}>
        <div className="makeup-form-intro"><FileText size={21} /><span>Complete both fields to submit your request.</span></div>
        {error && <div className="notice error" role="alert">{error}</div>}
        <label>
          Visitor name
          <input name="visitor_name" value={visitorName} onChange={(event) => setVisitorName(event.target.value)} maxLength={160} autoComplete="name" required />
        </label>
        <label>
          Host club
          <input name="host_club" value={hostClub} onChange={(event) => setHostClub(event.target.value)} maxLength={160} placeholder="Your Rotary club" required />
        </label>
        <button className="button blue-button makeup-submit" disabled={busy}>
          {busy ? 'Submitting request…' : 'Submit make-up request'} {!busy && <ArrowRight size={17} />}
        </button>
        <small className="makeup-privacy-note">Your request date is recorded automatically when you submit.</small>
      </form>
    </main>
  );
}

export function MakeupRequestList() {
  const router = useRouter();
  const [rows, setRows] = useState<MakeupRequest[]>([]);
  const [status, setStatus] = useState<MakeupStatus | ''>('pending');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api<any>(`/api/makeup-requests?page=${page}&limit=20${status ? `&status=${status}` : ''}`)
      .then((result) => {
        if (!active) return;
        setRows(items<MakeupRequest>(result));
        setPages(Number(result?.meta?.total_pages || 1));
      })
      .catch((cause: any) => {
        if (!active) return;
        setError(cause.message || 'Could not load make-up requests.');
        if (cause.status === 401 || cause.status === 403) router.replace('/admin/login');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, status, router]);

  return (
    <main className="page makeup-admin-page"><SignOutButton role="admin"/>
      <span className="eyebrow">ADMINISTRATION / VISITOR SERVICES</span>
      <div className="makeup-admin-heading">
        <div><h1>Make-up card requests</h1><p>Review visiting Rotarians’ attendance requests.</p></div>
        <label className="makeup-status-filter">Filter by status
          <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as MakeupStatus | ''); }}>
            <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="">All requests</option>
          </select>
        </label>
      </div>
      {error && <div className="notice error" role="alert">{error}</div>}
      {loading ? <RowListSkeleton count={6} /> : rows.length ? (
        <div className="makeup-request-list">
          <div className="makeup-list-labels"><span>VISITOR</span><span>REQUEST DATE</span><span>STATUS</span><span>SUBMITTED</span><span /></div>
          {rows.map((request) => (
            <Link className="makeup-request-row" href={`/admin/makeup-requests/${request.id}`} key={request.id}>
              <span className="makeup-visitor-cell"><strong>{request.visitor_name}</strong><small>{request.host_club}</small></span>
              <span>{dateLabel(request)}</span>
              <StatusBadge status={request.status} />
              <span className="makeup-created-date">{formatDateTime(request.created_at)}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : !error ? <div className="makeup-empty"><ClipboardList size={26} /><strong>No {status || ''} requests</strong><p>New make-up card requests will appear here.</p></div> : null}
      {!loading && !error && <div className="pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div>}
    </main>
  );
}

export function MakeupRequestReview() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<MakeupRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<ReviewMode>(null);
  const [presidentName, setPresidentName] = useState('');
  const [secretaryName, setSecretaryName] = useState('');
  const [repairPresidentName, setRepairPresidentName] = useState('');
  const [repairSecretaryName, setRepairSecretaryName] = useState('');
  const [repairingCard, setRepairingCard] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const me = unwrap(await api<Envelope<{ role: string }>>('/api/auth/me'));
      if (me?.role !== 'admin') {
        router.replace('/admin/login');
        return;
      }
      const result = await api<Envelope<MakeupRequest>>(`/api/makeup-requests/${params.id}`);
      setRequest(unwrap(result));
    } catch (cause: any) {
      setError(cause.message || 'Could not load this request.');
      if (cause.status === 401 || cause.status === 403) router.replace('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [params.id]);

  async function review(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request || !mode) return;
    setBusy(true);
    setError('');
    setMessage('');
    const path = `/api/makeup-requests/${request.id}/${mode}`;
    const body = mode === 'approve'
      ? { president_name: presidentName.trim(), secretary_name: secretaryName.trim() }
      : { rejection_note: rejectionNote.trim() || undefined };
    try {
      const result = await api<Envelope<MakeupRequest>>(path, { method: 'POST', body: JSON.stringify(body) });
      setRequest(unwrap(result));
      setMessage(mode === 'approve' ? 'Request approved and the PDF card is ready.' : 'Request rejected.');
      setMode(null);
      setPresidentName('');
      setSecretaryName('');
      setRejectionNote('');
    } catch (cause: any) {
      if (cause.status === 409) {
        await load();
        setError('This request has already been reviewed. The latest status is shown below.');
      } else {
        setError(cause.message || 'Could not review this request.');
      }
      if (cause.status === 401 || cause.status === 403) router.replace('/admin/login');
    } finally {
      setBusy(false);
    }
  }

  async function repairApprovedCard(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request) return;
    setRepairingCard(true);
    setError('');
    setMessage('');
    try {
      const result = await api<Envelope<MakeupRequest>>(`/api/makeup-requests/${request.id}/officers`, {
        method: 'PUT',
        body: JSON.stringify({
          secretary_name: repairSecretaryName.trim() || request.secretary_name || '',
          president_name: repairPresidentName.trim() || undefined,
        }),
      });
      setRequest(unwrap(result));
      setRepairSecretaryName('');
      setRepairPresidentName('');
      setMessage('Officer details saved and the PDF card was regenerated.');
    } catch (cause: any) {
      setError(cause.message || 'Could not update the officer names or regenerate the card.');
      if (cause.status === 401 || cause.status === 403) router.replace('/admin/login');
    } finally {
      setRepairingCard(false);
    }
  }

  async function download() {
    if (!request) return;
    setDownloading(true);
    setError('');
    try {
      await downloadApiFile(`/api/makeup-requests/${request.id}/card`, `makeup-card-${request.id}.pdf`);
    } catch (cause: any) {
      setError(cause.message || 'Could not download the card.');
      if (cause.status === 401 || cause.status === 403) router.replace('/admin/login');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="page makeup-admin-page"><SignOutButton role="admin"/>
      <Link className="back makeup-back" href="/admin/makeup-requests"><ArrowLeft size={15} /> All requests</Link>
      {error && <div className="notice error" role="alert">{error}</div>}
      {message && <div className="notice success" role="status">{message}</div>}
      {loading ? <RowListSkeleton count={4} /> : request ? (
        <>
          <div className="makeup-review-heading">
            <div><span className="eyebrow">MAKE-UP REQUEST</span><h1>Request {request.id}</h1></div>
            <StatusBadge status={request.status} />
          </div>
          <section className="makeup-review-card">
            <div className="makeup-review-person"><span className="makeup-review-avatar">{request.visitor_name.trim().charAt(0).toUpperCase()}</span><div><small>VISITING ROTARIAN</small><h2>{request.visitor_name}</h2><p>{request.host_club}</p></div></div>
            <dl className="makeup-detail-grid">
              <div><dt>Request date</dt><dd>{dateLabel(request)}</dd></div>
              <div><dt>Submitted</dt><dd>{formatDateTime(request.created_at)}</dd></div>
              {request.president_name && <div><dt>Club President</dt><dd>{request.president_name}</dd></div>}
              {request.secretary_name && <div><dt>Club Secretary</dt><dd>{request.secretary_name}</dd></div>}
            </dl>
            {request.status === 'rejected' && request.rejection_note && <div className="makeup-rejection-note"><strong>Rejection note</strong><p>{request.rejection_note}</p></div>}
            {request.status === 'approved' && (!request.secretary_name || request.card_available === false) && (
              <form className="form makeup-officer-repair" onSubmit={repairApprovedCard}>
                <div>
                  <span className="eyebrow">UPDATE CARD OFFICERS</span>
                  <h2>Complete the approved card</h2>
                  <p>Add or confirm the Club Secretary’s name to regenerate this approved card.</p>
                </div>
                <label>Club Secretary’s name<input value={repairSecretaryName || request.secretary_name || ''} onChange={(event) => setRepairSecretaryName(event.target.value)} maxLength={160} required /></label>
                <label>Club President’s name (optional)<input value={repairPresidentName} onChange={(event) => setRepairPresidentName(event.target.value)} maxLength={160} placeholder={request.president_name || ''} /></label>
                <button className="button blue-button" disabled={repairingCard}>{repairingCard ? 'Regenerating card…' : 'Save names & regenerate PDF'}</button>
              </form>
            )}
            <div className="makeup-review-actions">
              {request.status === 'pending' ? <>
                <button className="button blue-button" onClick={() => setMode('approve')}>Approve request</button>
                <button className="button makeup-reject-button" onClick={() => setMode('reject')}>Reject request</button>
              </> : request.status === 'approved' && request.secretary_name && request.card_available !== false ? (
                <button className="button blue-button" onClick={download} disabled={downloading}><Download size={17} /> {downloading ? 'Preparing PDF…' : 'Download PDF card'}</button>
              ) : null}
              <Link href="/admin/makeup-requests" className="text-link">Back to requests <ArrowRight size={15} /></Link>
            </div>
          </section>
        </>
      ) : !error ? <div className="empty">Request not found.</div> : null}

      {mode && request?.status === 'pending' && <div className="modal-backdrop" role="presentation">
        <form className="form admin-form makeup-review-modal" onSubmit={review} role="dialog" aria-modal="true" aria-labelledby="makeup-review-title">
          <button type="button" className="modal-close" onClick={() => setMode(null)} aria-label="Close">×</button>
          <span className="eyebrow">{mode === 'approve' ? 'APPROVE MAKE-UP' : 'REJECT MAKE-UP'}</span>
          <h2 id="makeup-review-title">{mode === 'approve' ? 'Approve this visit?' : 'Reject this request?'}</h2>
          <p>{mode === 'approve' ? 'The PDF make-up card will be generated after approval.' : 'The request will be marked as rejected. You may add an internal note.'}</p>
          {mode === 'approve' ? <>
            <label>Club President’s name<input autoFocus value={presidentName} onChange={(event) => setPresidentName(event.target.value)} maxLength={160} required /></label>
            <label>Club Secretary’s name<input value={secretaryName} onChange={(event) => setSecretaryName(event.target.value)} maxLength={160} required /></label>
          </> : <label>Rejection note (optional)<textarea rows={4} maxLength={1000} value={rejectionNote} onChange={(event) => setRejectionNote(event.target.value)} /></label>}
          {error && <div className="notice error" role="alert">{error}</div>}
          <div className="form-actions"><button type="button" onClick={() => setMode(null)}>Cancel</button><button className={`button ${mode === 'approve' ? 'blue-button' : 'makeup-reject-button'}`} disabled={busy}>{busy ? 'Saving…' : mode === 'approve' ? 'Approve & generate PDF' : 'Confirm rejection'}</button></div>
        </form>
      </div>}
    </main>
  );
}
