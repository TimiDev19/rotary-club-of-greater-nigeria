'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { api, items, type Entity } from '@/lib/api';
import { Reveal } from '@/components/reveal';
import { CardGridSkeleton } from '@/components/loading';
import { formatDate, sortBulletins } from '@/lib/date';

async function loadAllBulletins(search = ''): Promise<Entity[]> {
  const endpoint = '/api/bulletins';
  const limit = 20;
  const query = `limit=${limit}&search=${encodeURIComponent(search)}`;
  const first = await api<any>(`${endpoint}?page=1&${query}`);
  const results = items<Entity>(first);
  const totalPages = Number(first?.meta?.total_pages || 1);
  if (totalPages <= 1) return sortBulletins(results);
  const remaining = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      api<any>(`${endpoint}?page=${index + 2}&${query}`),
    ),
  );
  return sortBulletins(results.concat(...remaining.map((value) => items<Entity>(value))));
}

export function DataSection({
  endpoint,
  title,
  kicker,
  href,
  id,
  empty = 'New stories from the club will appear here.',
}: {
  endpoint: string;
  title: string;
  kicker: string;
  href: string;
  id?: string;
  empty?: string;
}) {
  const [rows, setRows] = useState<Entity[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (endpoint === '/api/bulletins' ? loadAllBulletins() : api<unknown>(endpoint).then(items<Entity>))
      .then((data) => {
        setRows(endpoint === '/api/bulletins' ? sortBulletins(data) : data);
      })
      .catch((cause) => setError(cause.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  const officers = endpoint === '/api/club-officers';
  const presidents = endpoint === '/api/past-presidents';
  const people = officers || presidents;

  return (
    <section id={id} className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">{kicker}</span>
          <h2>{title}</h2>
        </div>
        <Link className="text-link" href={href}>
          View all <ArrowUpRight size={17} />
        </Link>
      </div>
      {loading ? (
        <CardGridSkeleton count={3} variant={people ? 'officer' : 'story'} />
      ) : error ? (
        <div className="notice">{error}</div>
      ) : rows.length === 0 ? (
        <div className="empty">{empty}</div>
      ) : people ? (
        <Reveal className="officer-grid officer-grid-home">
          {rows.slice(0, 3).map((row, index) => (
            <OfficerCard
              key={row.id}
              person={row}
              index={index}
              variant={presidents ? 'president' : 'officer'}
            />
          ))}
        </Reveal>
      ) : (
        <Reveal className="cards">
          {rows.slice(0, 3).map((row, index) => (
            <article className="story-card" key={row.id}>
              <div
                className={`card-image tone-${index}`}
                style={row.image || row.image_url ? { backgroundImage: `url(${row.image || row.image_url})` } : undefined}
              >
                <span className="image-caption">
                  {row.date ? formatDate(row.date) : row.created_at ? formatDate(row.created_at) : 'Rotary in action'}
                </span>
              </div>
              <div className="card-copy">
                <span className="eyebrow">
                  {row.date ? formatDate(row.date) : row.created_at ? formatDate(row.created_at) : 'Our community'}
                </span>
                <h3>
                  <Link href={`${href}/${row.id}`}>{row.title || row.name || 'Untitled story'}</Link>
                </h3>
                <p className={endpoint === '/api/projects' ? 'project-description' : undefined}>
                  {row.description || row.content || 'Discover the people and work behind this story.'}
                </p>
                <Link className="text-link" href={`${href}/${row.id}`}>
                  {endpoint === '/api/projects' ? 'Read more' : 'Read story'} <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </Reveal>
      )}
    </section>
  );
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function OfficerCard({
  person,
  index,
  variant = 'officer',
}: {
  person: Entity;
  index: number;
  variant?: 'officer' | 'president';
}) {
  const president = variant === 'president';
  const name = person.full_name || person.name || (president ? 'Past president' : 'Club officer');
  const label = president ? 'PAST PRESIDENT' : 'IN SERVICE';
  const detail = president ? person.year_served : person.position;
  return (
    <article className={`officer-card officer-palette-${index % 4}`}>
      <div className="officer-spark" aria-hidden="true">✳</div>
      <div className="officer-avatar">
        {person.image_url ? <img src={person.image_url} alt={name} /> : <span aria-label={`Portrait unavailable for ${name}`}>{initials(name)}</span>}
      </div>
      <div className="officer-copy">
        <span className="officer-kicker">{label}</span>
        <h2>{name}</h2>
        <p>{detail || (president ? 'Past president' : 'Club officer')}</p>
      </div>
    </article>
  );
}

export function Collection({
  endpoint,
  title,
  kicker,
}: {
  endpoint: string;
  title: string;
  kicker: string;
}) {
  const [rows, setRows] = useState<Entity[]>([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const bulletins = endpoint === '/api/bulletins';
  const requestPage = bulletins ? 1 : page;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const load = async () => {
      if (bulletins) {
        const results = await loadAllBulletins(query);
        if (active) {
          setRows(results);
          setPages(Math.max(1, Math.ceil(results.length / 10)));
        }
      } else {
        const value = await api<any>(`${endpoint}?page=${requestPage}&limit=10&search=${encodeURIComponent(query)}`);
        const results = items<Entity>(value);
        if (!active) return;
        setRows(results);
        setPages(value?.meta?.total_pages || 1);
      }
    };
    load()
      .catch((cause) => { if (active) setError(cause.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [endpoint, requestPage, query, bulletins]);

  const officers = endpoint === '/api/club-officers';
  const presidents = endpoint === '/api/past-presidents';
  const people = officers || presidents;
  const visibleRows = bulletins ? rows.slice((page - 1) * 10, page * 10) : rows;

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">{kicker}</span>
        <h1>{title}</h1>
        <p>{officers ? 'Meet the people serving our club and community.' : presidents ? 'Celebrate the leaders who have guided our club.' : 'Explore the people, projects and stories shaping our shared service.'}</p>
      </div>
      <label className="search">
        Search
        <input value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }} placeholder={`Search ${title.toLowerCase()}…`} />
      </label>
      {loading ? (
        <CardGridSkeleton count={6} variant={people ? 'officer' : 'story'} />
      ) : error ? (
        <div className="notice">{error}</div>
      ) : rows.length ? (
        people ? (
          <div className="officer-grid">{rows.map((row, index) => <OfficerCard key={row.id} person={row} index={index} variant={presidents ? 'president' : 'officer'} />)}</div>
        ) : (
          <div className="cards">
            {visibleRows.map((row, index) => (
              <article className="story-card" key={row.id}>
                <div className={`card-image tone-${index % 3}`} style={row.image_url ? { backgroundImage: `url(${row.image_url})` } : undefined} />
                <div className="card-copy">
                  <span className="eyebrow"><CalendarDays size={13} /> {row.date ? formatDate(row.date) : row.year_served || row.position || (row.created_at ? formatDate(row.created_at) : 'Club story')}</span>
                  <h3>{endpoint === '/api/projects' || endpoint === '/api/bulletins' ? <Link href={`${endpoint.replace('/api', '')}/${row.id}`}>{row.title || row.full_name || row.name || 'Club member'}</Link> : row.title || row.full_name || row.name || 'Club member'}</h3>
                  <p className={endpoint === '/api/projects' ? 'project-description' : undefined}>{row.description || row.content || row.year_served || row.position || 'Learn more about our work and community.'}</p>
                  {endpoint === '/api/projects' && <Link className="text-link" href={`/projects/${row.id}`}>Read more <ArrowUpRight size={16} /></Link>}
                </div>
              </article>
            ))}
          </div>
        )
      ) : (
        <div className="empty">No published items are available yet.</div>
      )}
      {!loading && !error && <div className="pagination"><button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</button><span>Page {page} of {pages}</span><button onClick={() => setPage(page + 1)} disabled={page >= pages}>Next</button></div>}
    </main>
  );
}
