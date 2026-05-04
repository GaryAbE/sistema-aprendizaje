'use client';

import { useState, useRef, useEffect } from 'react';
import { useIdioma } from '@/context/IdiomaContext';
import { IDIOMAS, type Idioma } from '@/lib/i18n';
import { Globe, Check } from 'lucide-react';

export default function IdiomaSelector({ variant = 'icon' }: { variant?: 'icon' | 'full' }) {
  const { idioma, setIdioma } = useIdioma();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = IDIOMAS.find(l => l.value === idioma) ?? IDIOMAS[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/80 backdrop-blur border border-white/60 shadow-sm px-3 py-2 rounded-2xl font-bold text-slate-600 hover:shadow-md transition-all text-sm"
        title="Cambiar idioma"
      >
        <span className="text-lg">{current.bandera}</span>
        {variant === 'full' && <span className="hidden sm:inline">{current.nombreNativo}</span>}
        <Globe size={16} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 anim-fadeInUp">
          {IDIOMAS.map(lang => (
            <button
              key={lang.value}
              onClick={() => { setIdioma(lang.value); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${idioma === lang.value ? 'bg-brand-primary/5' : ''}`}
            >
              <span className="text-2xl">{lang.bandera}</span>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{lang.nombreNativo}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{lang.label}</p>
              </div>
              {idioma === lang.value && <Check size={16} className="text-brand-primary" strokeWidth={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
