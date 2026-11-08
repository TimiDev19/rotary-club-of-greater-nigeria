export type Entity = { id: string | number; title?: string; name?: string; full_name?: string; president_name?: string; message?: string; position?: string; year_served?: string; description?: string; content?: string; body?: string; image?: string; image_url?: string; pdf_url?: string; date?: string; created_at?: string; author?: { name?: string }; [key: string]: unknown };
export type Envelope<T> = { success: boolean; data?: T; meta?: { page?: number; limit?: number; total?: number; total_pages?: number }; message?: string; errors?: Record<string,string> };
const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
function clearSession(){ if(typeof window==='undefined')return; sessionStorage.removeItem('rotary_access_token');sessionStorage.removeItem('rotary_refresh_token');sessionStorage.removeItem('rotary_user');window.dispatchEvent(new Event('rotary:session-expired')); }
async function refreshAccessToken():Promise<string|null>{ if(typeof window==='undefined')return null;const refresh=sessionStorage.getItem('rotary_refresh_token');if(!refresh)return null;try{const body=await api<Envelope<{access_token:string;refresh_token:string;user:{id:string;email:string;role:string}}>>('/api/auth/refresh',{method:'POST',body:JSON.stringify({refresh_token:refresh})},undefined,true);const session=body.data;if(!session?.access_token)throw Error('Invalid refresh response');sessionStorage.setItem('rotary_access_token',session.access_token);if(session.refresh_token)sessionStorage.setItem('rotary_refresh_token',session.refresh_token);if(session.user)sessionStorage.setItem('rotary_user',JSON.stringify(session.user));return session.access_token;}catch{let role='';try{role=JSON.parse(sessionStorage.getItem('rotary_user')||'{}').role||''}catch{}clearSession();const loginPath=role==='admin'?'/admin/login':role==='member'?'/clubhouse/login':'/login';if(location.pathname!==loginPath)location.assign(loginPath);return null;} }
export async function api<T>(path: string, init: RequestInit = {}, token?: string, noRefresh=false): Promise<T> {
  if (!base) throw new ApiError(0, 'API is not configured. Set NEXT_PUBLIC_API_BASE_URL to connect club content.');
  const headers = new Headers(init.headers);
  const publicAuthPath=path==='/api/auth/login'||path==='/api/auth/refresh'||path==='/api/clubhouse/auth/login';
  const currentToken=token ?? (!publicAuthPath&&typeof window!=='undefined'?sessionStorage.getItem('rotary_access_token')||undefined:undefined);
  if (currentToken) headers.set('Authorization', `Bearer ${currentToken}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const res = await fetch(`${base}${path}`, { ...init, headers, cache: 'no-store' });
  if(res.status===401&&currentToken&&!noRefresh){const renewed=await refreshAccessToken();if(renewed)return api<T>(path,init,renewed,true);clearSession();throw new ApiError(401,'Your session has expired. Please sign in again.');}
  if (res.status === 204) return undefined as T;
  let result:any;try{result=await res.json()}catch{throw new ApiError(res.status,'The API returned an unreadable response.')}
  if(!res.ok||result?.success===false){const errors=result?.errors?Object.entries(result.errors).map(([k,v])=>`${k}: ${v}`).join(' • '):'';throw new ApiError(res.status,result?.message?`${result.message}${errors?` — ${errors}`:''}`:`Request failed (${res.status})`)}
  return result as T;
}
export async function logoutSession(role?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  let sessionRole = role;
  if (!sessionRole) {
    try { sessionRole = JSON.parse(sessionStorage.getItem('rotary_user') || '{}').role; } catch {}
  }
  if (sessionRole === 'admin') {
    try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
  }
  clearSession();
}
export async function downloadApiFile(path:string,filename:string):Promise<void>{
  if(!base)throw new ApiError(0,'API is not configured. Set NEXT_PUBLIC_API_BASE_URL to connect club content.');
  const request=(accessToken?:string)=>fetch(`${base}${path}`,{headers:accessToken?{Authorization:`Bearer ${accessToken}`}:{},cache:'no-store'});
  let accessToken=typeof window!=='undefined'?sessionStorage.getItem('rotary_access_token')||undefined:undefined;
  let response=await request(accessToken);
  if(response.status===401&&accessToken){const renewed=await refreshAccessToken();if(renewed){accessToken=renewed;response=await request(accessToken)}}
  if(!response.ok){let message='Could not download the card';try{const result=await response.json();message=result?.message||message}catch{}throw new ApiError(response.status,message)}
  const file=await response.blob();
  const url=URL.createObjectURL(file);const link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function unwrap<T>(v:Envelope<T>|T):T { return ((v as Envelope<T>)?.data??v) as T; }
export function items<T>(v: any): T[] { const x=unwrap<any>(v);if(Array.isArray(x))return x;if(Array.isArray(x?.data))return x.data;if(Array.isArray(v?.results))return v.results;return []; }
export function json(body: unknown): string { return JSON.stringify(body); }
