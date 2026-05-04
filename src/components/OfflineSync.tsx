'use client';

import { useEffect, useState } from 'react';

export default function OfflineSync() {
  const [isOffline, setIsOffline] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncOk, setSyncOk] = useState(false);

  useEffect(() => {
    function handleOffline() { setIsOffline(true); setSyncOk(false); }
    function handleOnline() {
      setIsOffline(false);
      syncPendingData();
    }

    setIsOffline(!navigator.onLine);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  async function syncPendingData() {
    const pending = JSON.parse(localStorage.getItem('pendingSync') ?? '[]');
    if (pending.length === 0) return;

    setSyncing(true);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producciones: pending }),
      });
      if (res.ok) {
        localStorage.removeItem('pendingSync');
        setSyncOk(true);
        setTimeout(() => setSyncOk(false), 3000);
      }
    } catch {
      // Sigue offline
    } finally {
      setSyncing(false);
    }
  }

  if (!isOffline && !syncing && !syncOk) return null;

  return (
    <div
      className={`offline-banner ${isOffline ? 'offline-banner--offline' : syncing ? 'offline-banner--syncing' : 'offline-banner--ok'}`}
      role="status"
      aria-live="polite"
    >
      {isOffline && '📵 Sin conexión — trabajando offline'}
      {syncing && '🔄 Sincronizando...'}
      {syncOk && '✅ Todo sincronizado'}
    </div>
  );
}
