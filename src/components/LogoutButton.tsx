'use client';

import { useRouter } from 'next/navigation';
import { t, type Idioma } from '@/lib/i18n';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ idioma }: { idioma: Idioma }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <button className="btn-burbuja btn--secundario !py-2 !px-4 text-sm !shadow-none hover:!bg-rose-50 hover:!text-rose-600 hover:!border-rose-200 group transition-all" onClick={handleLogout}>
      <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> {t(idioma, 'salir')}
    </button>
  );
}
