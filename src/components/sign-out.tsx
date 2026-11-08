'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logoutSession } from '@/lib/api';

export function SignOutButton({ role }: { role: 'admin' | 'member' }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setBusy(true);
    await logoutSession(role);
    router.replace(role === 'admin' ? '/admin/login' : '/clubhouse/login');
  }

  return (
    <div className="page-session-actions">
      <button className="button sign-out-button" type="button" onClick={signOut} disabled={busy}>
        <LogOut size={16} aria-hidden="true" />
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  );
}
