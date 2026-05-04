'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Idioma } from '@/lib/i18n';

type IdiomaContextType = {
  idioma: Idioma;
  setIdioma: (lang: Idioma) => void;
};

const IdiomaContext = createContext<IdiomaContextType>({
  idioma: 'es',
  setIdioma: () => {},
});

export function IdiomaProvider({ children, initialIdioma }: { children: ReactNode; initialIdioma?: Idioma }) {
  const [idioma, setIdiomaState] = useState<Idioma>(initialIdioma ?? 'es');

  // Sync with localStorage for client-side persistence
  useEffect(() => {
    const stored = localStorage.getItem('ava_idioma') as Idioma | null;
    if (stored && ['es', 'ay', 'qu', 'gu'].includes(stored)) {
      setIdiomaState(stored);
    }
  }, []);

  function setIdioma(lang: Idioma) {
    setIdiomaState(lang);
    localStorage.setItem('ava_idioma', lang);
    // Also update on server
    fetch('/api/idioma', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idioma: lang }),
    }).catch(() => {});
  }

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  return useContext(IdiomaContext);
}
