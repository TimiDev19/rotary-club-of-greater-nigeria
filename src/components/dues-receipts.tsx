'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, FilePlus2, Receipt, Search, Trash2 } from 'lucide-react';
import { api, downloadApiFile, items, unwrap, type Envelope } from '@/lib/api';
import { formatDate } from '@/lib/date';
import { RowListSkeleton } from '@/components/loading';
import { SignOutButton } from '@/components/sign-out';

type DuesReceipt = {
  id: string | number;
  receipt_date: string;
  rotarian_name: string;
  amount_paid: string;
  rotary_year: string;
  president_name: string;
  secretary_name: string;
};
type ReceiptFields = Omit<DuesReceipt, 'id'>;
const blankFields: ReceiptFields = { receipt_date: '', rotarian_name: '', amount_paid: '', rotary_year: '', president_name: '', secretary_name: '' };

function formatNairaAmount(value: string) {
  const cleaned = value.replace(/[^\d.]/g, '');
  if (!cleaned) return '';
  const [whole = '', ...decimalParts] = cleaned.split('.');
  const hasDecimal = cleaned.includes('.');
  const decimals = decimalParts.join('').slice(0, 2);
  const groupedWhole = (whole || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₦${groupedWhole}${hasDecimal ? `.${decimals}` : ''}`;
}

function ReceiptForm({ initial, onSave, busy }: { initial: ReceiptFields; onSave: (fields: ReceiptFields) => Promise<void>; busy: boolean }) {
  const [fields, setFields] = useState(() => ({ ...initial, amount_paid: formatNairaAmount(initial.amount_paid) }));
  function update(key: keyof ReceiptFields, value: string) { setFields((current) => ({ ...current, [key]: value })); }
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); await onSave(fields); }
  return <form className="form dues-receipt-form" onSubmit={submit}>
    <label>Date paid<input type="date" value={fields.receipt_date} onChange={(e) => update('receipt_date', e.target.value)} required /></label>
    <label>Name of Rotarian<input value={fields.rotarian_name} onChange={(e) => update('rotarian_name', e.target.value)} maxLength={160} autoComplete="name" required /></label>
    <label>Amount paid<input value={fields.amount_paid} onChange={(e) => update('amount_paid', formatNairaAmount(e.target.value))} maxLength={80} inputMode="decimal" placeholder="₦250,000.00" required /></label>
    <label>Rotary year<input value={fields.rotary_year} onChange={(e) => update('rotary_year', e.target.value)} pattern="[0-9]{4}/[0-9]{2}" placeholder="2026/27" title="Use the YYYY/YY format, for example 2026/27" required /></label>
    <label>President’s name<input value={fields.president_name} onChange={(e) => update('president_name', e.target.value)} maxLength={160} required /></label>
    <label>Club secretary’s name<input value={fields.secretary_name} onChange={(e) => update('secretary_name', e.target.value)} maxLength={160} required /></label>
    <div className="dues-form-actions"><Link className="text-link" href="/admin/dues-receipts">Cancel</Link><button className="button blue-button" disabled={busy}>{busy ? 'Saving…' : 'Save receipt'}</button></div>
  </form>;
}

export function DuesReceiptList() {
  const router = useRouter();
  const [rows, setRows] = useState<DuesReceipt[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const query = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) query.set('search', search);
    if (year) query.set('rotary_year', year);
    try {
      const result: any = await api(`/api/dues-receipts?${query.toString()}`);
      setRows(items<DuesReceipt>(result));
      setPages(Number(result?.meta?.total_pages || 1));
    } catch (cause: any) {
      setError(cause.message || 'Could not load dues receipts.');
      if (cause.status === 401 || cause.status === 403) router.replace('/admin/login');
    } finally { setLoading(false); }
  }, [page, search, year, router]);
  useEffect(() => { load(); }, [load]);

  async function remove(receipt: DuesReceipt) {
    if (!confirm(`Delete the dues receipt for ${receipt.rotarian_name}? Its PDF will no longer be available.`)) return;
    setDeleting(receipt.id); setError(''); setMessage('');
    try { await api(`/api/dues-receipts/${receipt.id}`, { method: 'DELETE' }); setMessage('Receipt deleted.'); await load(); }
    catch (cause: any) { setError(cause.message || 'Could not delete the receipt.'); if (cause.status === 401 || cause.status === 403) router.replace('/admin/login'); }
    finally { setDeleting(null); }
  }
  async function download(receipt: DuesReceipt) {
    setError('');
    try { await downloadApiFile(`/api/dues-receipts/${receipt.id}/pdf`, `dues-receipt-${receipt.id}.pdf`); }
    catch (cause: any) { setError(cause.message || 'Could not download the receipt.'); if (cause.status === 401 || cause.status === 403) router.replace('/admin/login'); }
  }

  return <main className="page dues-receipts-page"><SignOutButton role="admin" />
    <span className="eyebrow">ADMINISTRATION / FINANCE</span>
    <div className="admin-heading"><div><h1>Dues receipts</h1><p>Create, manage, and download member dues receipts.</p></div><Link className="button blue-button" href="/admin/dues-receipts/new"><FilePlus2 size={17} /> New receipt</Link></div>
    <form className="dues-receipt-filters" onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(searchInput.trim()); }}>
      <label><span>Search Rotarian</span><div><Search size={17} /><input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Enter a name" /></div></label>
      <label><span>Rotary year</span><input value={year} onChange={(e) => { setPage(1); setYear(e.target.value); }} placeholder="2026/27" pattern="[0-9]{4}/[0-9]{2}" title="Use YYYY/YY format" /></label>
      <button className="button blue-button">Search receipts</button>
    </form>
    {message && <div className="notice success" role="status">{message}</div>}{error && <div className="notice error" role="alert">{error}</div>}
    {loading ? <RowListSkeleton count={6} /> : rows.length ? <div className="dues-receipt-list">
      <div className="dues-receipt-list-labels"><span>ROTARIAN</span><span>DATE PAID</span><span>AMOUNT</span><span>ROTARY YEAR</span><span>ACTIONS</span></div>
      {rows.map((receipt) => <article className="dues-receipt-row" key={receipt.id}>
        <div className="dues-receipt-person"><span><Receipt size={19} /></span><strong>{receipt.rotarian_name}</strong></div>
        <span>{receipt.receipt_date ? formatDate(receipt.receipt_date) : '—'}</span><strong>{receipt.amount_paid}</strong><span>{receipt.rotary_year}</span>
        <div className="dues-receipt-actions"><Link href={`/admin/dues-receipts/${receipt.id}`} aria-label={`View or edit receipt for ${receipt.rotarian_name}`}>View / edit</Link><button type="button" onClick={() => download(receipt)} aria-label={`Download receipt for ${receipt.rotarian_name}`}><Download size={16} /> PDF</button><button type="button" className="dues-delete-action" onClick={() => remove(receipt)} disabled={deleting === receipt.id} aria-label={`Delete receipt for ${receipt.rotarian_name}`}><Trash2 size={16} />{deleting === receipt.id ? 'Deleting…' : 'Delete'}</button></div>
      </article>)}
    </div> : !error ? <div className="dues-receipt-empty"><Receipt size={27} /><strong>No dues receipts found</strong><p>New receipts will appear here after you create them.</p><Link href="/admin/dues-receipts/new">Create a receipt <ArrowRight size={15} /></Link></div> : null}
    {!loading && !error && rows.length > 0 && <div className="pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div>}
  </main>;
}

export function NewDuesReceipt() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<DuesReceipt | null>(null);
  async function save(fields: ReceiptFields) {
    setBusy(true); setError('');
    try { const result = await api<Envelope<DuesReceipt>>('/api/dues-receipts', { method: 'POST', body: JSON.stringify(fields) }); setCreated(unwrap(result)); }
    catch (cause: any) { setError(cause.message || 'Could not create the receipt.'); if (cause.status === 401 || cause.status === 403) router.replace('/admin/login'); }
    finally { setBusy(false); }
  }
  async function download() {
    if (!created) return; setDownloading(true); setError('');
    try { await downloadApiFile(`/api/dues-receipts/${created.id}/pdf`, `dues-receipt-${created.id}.pdf`); }
    catch (cause: any) { setError(cause.message || 'Could not download the receipt PDF.'); if (cause.status === 401 || cause.status === 403) router.replace('/admin/login'); }
    finally { setDownloading(false); }
  }
  return <main className="page dues-receipts-page"><SignOutButton role="admin" /><Link className="back" href="/admin/dues-receipts"><ArrowLeft size={15} /> All receipts</Link><span className="eyebrow">ADMINISTRATION / FINANCE</span><h1>Create dues receipt</h1><p className="lead">Enter the details exactly as they should appear on the receipt.</p>
    {error && <div className="notice error" role="alert">{error}</div>}
    {created ? <section className="dues-created-card" role="status"><span className="eyebrow">RECEIPT CREATED</span><h2>{created.rotarian_name}</h2><p>{created.rotary_year} · {created.amount_paid}</p><div><button className="button blue-button" onClick={download} disabled={downloading}><Download size={17} />{downloading ? 'Preparing PDF…' : 'Download receipt PDF'}</button><button className="button dues-secondary-button" onClick={() => router.push(`/admin/dues-receipts/${created.id}`)}>View receipt details</button><button className="button dues-back-button" onClick={() => router.push('/admin/dues-receipts')}><ArrowLeft size={16} /> Back to receipts</button></div></section> : <ReceiptForm initial={blankFields} onSave={save} busy={busy} />}
  </main>;
}

export function EditDuesReceipt() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [receipt, setReceipt] = useState<DuesReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    api<Envelope<DuesReceipt>>(`/api/dues-receipts/${params.id}`).then((result) => { if (active) setReceipt(unwrap(result)); })
      .catch((cause: any) => { if (!active) return; setError(cause.message || 'Could not load this receipt.'); if (cause.status === 401 || cause.status === 403) router.replace('/admin/login'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params.id, router]);

  async function save(fields: ReceiptFields) {
    if (!receipt) return; setBusy(true); setError(''); setMessage('');
    try { const result = await api<Envelope<DuesReceipt>>(`/api/dues-receipts/${receipt.id}`, { method: 'PUT', body: JSON.stringify(fields) }); setReceipt(unwrap(result)); setMessage('Receipt updated. The next PDF download will use these values.'); }
    catch (cause: any) { setError(cause.message || 'Could not update the receipt.'); if (cause.status === 401 || cause.status === 403) router.replace('/admin/login'); }
    finally { setBusy(false); }
  }
  async function download() {
    if (!receipt) return; setDownloading(true); setError('');
    try { await downloadApiFile(`/api/dues-receipts/${receipt.id}/pdf`, `dues-receipt-${receipt.id}.pdf`); }
    catch (cause: any) { setError(cause.message || 'Could not download the receipt PDF.'); if (cause.status === 401 || cause.status === 403) router.replace('/admin/login'); }
    finally { setDownloading(false); }
  }

  return <main className="page dues-receipts-page"><SignOutButton role="admin" /><Link className="back" href="/admin/dues-receipts"><ArrowLeft size={15} /> All receipts</Link><span className="eyebrow">ADMINISTRATION / FINANCE</span><h1>{receipt?.rotarian_name || 'Receipt details'}</h1>
    {error && <div className="notice error" role="alert">{error}</div>}{message && <div className="notice success" role="status">{message}</div>}
    {loading ? <RowListSkeleton count={4} /> : receipt ? <><div className="dues-receipt-summary"><span><small>RECEIPT ID</small><strong>{receipt.id}</strong></span><span><small>DATE PAID</small><strong>{receipt.receipt_date ? formatDate(receipt.receipt_date) : '—'}</strong></span></div><ReceiptForm key={receipt.id + receipt.receipt_date + receipt.rotarian_name + receipt.amount_paid + receipt.rotary_year + receipt.president_name + receipt.secretary_name} initial={{ receipt_date: receipt.receipt_date?.slice(0, 10) || '', rotarian_name: receipt.rotarian_name, amount_paid: receipt.amount_paid, rotary_year: receipt.rotary_year, president_name: receipt.president_name, secretary_name: receipt.secretary_name }} onSave={save} busy={busy} /><button className="button blue-button dues-download-detail" onClick={download} disabled={downloading}><Download size={17} />{downloading ? 'Preparing PDF…' : 'Download receipt PDF'}</button></> : !error ? <div className="empty">Receipt not found.</div> : null}
  </main>;
}
