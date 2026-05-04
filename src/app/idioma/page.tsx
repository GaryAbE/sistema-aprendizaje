'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IDIOMAS, t, type Idioma } from '@/lib/i18n';
import { useIdioma } from '@/context/IdiomaContext';
import { Globe, Check, Sparkles, ArrowRight } from 'lucide-react';

const IDIOMA_DESCRIPTIONS: Record<Idioma, { subtitle: string; greeting: string; color: string }> = {
  es: { subtitle: 'Español / Castellano', greeting: '¡Hola! ¿Cómo estás?', color: '#6366f1' },
  ay: { subtitle: 'Lengua del Altiplano', greeting: 'Kamisaraki!', color: '#10b981' },
  qu: { subtitle: 'Qhichwa Simi', greeting: 'Imaynalla!', color: '#f59e0b' },
  gu: { subtitle: "Avañe'ẽ", greeting: "Mba'éichapa!", color: '#f43f5e' },
};

function IdiomaPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { idioma: currentIdioma, setIdioma } = useIdioma();
  const [selected, setSelected] = useState<Idioma>(currentIdioma);
  const [cargando, setCargando] = useState(false);
  const [hovered, setHovered] = useState<Idioma | null>(null);

  const nextUrl = searchParams.get('next') || '/mapa';

  useEffect(() => {
    setSelected(currentIdioma);
  }, [currentIdioma]);

  async function handleContinuar() {
    setCargando(true);
    setIdioma(selected);
    try {
      await fetch('/api/idioma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idioma: selected }),
      });
    } catch { /* ignore */ }
    router.push(nextUrl);
  }

  const activeDesc = IDIOMA_DESCRIPTIONS[hovered ?? selected];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff0f8 100%)' }}>
      
      {/* Animated background blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full blur-3xl opacity-30 transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${activeDesc.color}55 0%, transparent 70%)` }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${activeDesc.color}44 0%, transparent 70%)` }} />

      <div className="relative z-10 w-full max-w-2xl space-y-10 anim-fadeInUp">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-white/80 backdrop-blur rounded-[2rem] shadow-2xl flex items-center justify-center mx-auto anim-flotar"
            style={{ boxShadow: `0 20px 60px ${activeDesc.color}30` }}>
            <Globe size={52} style={{ color: activeDesc.color }} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {t(selected, 'idioma_titulo')}
            </h1>
            <p className="text-xl text-slate-500 mt-2 font-medium transition-all duration-300">
              {activeDesc.greeting}
            </p>
          </div>
        </div>

        {/* Language Cards */}
        <div className="grid grid-cols-2 gap-4">
          {IDIOMAS.map((idioma) => {
            const desc = IDIOMA_DESCRIPTIONS[idioma.value];
            const isSelected = selected === idioma.value;
            return (
              <button
                key={idioma.value}
                type="button"
                onClick={() => setSelected(idioma.value)}
                onMouseEnter={() => setHovered(idioma.value)}
                onMouseLeave={() => setHovered(null)}
                className={`relative p-6 rounded-[2rem] border-4 transition-all duration-300 text-left flex flex-col gap-3 group ${
                  isSelected
                    ? 'bg-white border-[var(--c)] shadow-2xl scale-[1.03]'
                    : 'bg-white/60 backdrop-blur border-white hover:bg-white hover:scale-[1.01] hover:shadow-xl shadow-md'
                }`}
                style={{ '--c': desc.color } as React.CSSProperties}
              >
                {/* Emoji flag */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner transition-transform duration-300 ${
                  isSelected ? 'rotate-3 scale-110' : 'group-hover:rotate-3'
                }`}
                  style={{ background: isSelected ? `${desc.color}18` : '#f1f5f9' }}>
                  {idioma.bandera}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-800">{idioma.nombreNativo}</span>
                    {isSelected && <Sparkles size={16} style={{ color: desc.color }} />}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: isSelected ? desc.color : '#94a3b8' }}>
                    {desc.subtitle}
                  </p>
                </div>

                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg anim-bounceIn"
                    style={{ background: desc.color }}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}

                {/* Active border glow */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-[2rem] pointer-events-none"
                    style={{ boxShadow: `0 0 0 4px ${desc.color}40, 0 20px 40px ${desc.color}20` }} />
                )}
              </button>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleContinuar}
            disabled={cargando}
            className="w-full py-5 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-3 transition-all active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${activeDesc.color} 0%, ${activeDesc.color}cc 100%)`,
              boxShadow: `0 10px 40px ${activeDesc.color}50`,
              opacity: cargando ? 0.8 : 1
            }}
          >
            {cargando ? (
              <div className="flex gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            ) : (
              <>
                {t(selected, 'idioma_empezar')} <ArrowRight size={24} />
              </>
            )}
          </button>

          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center">
            Puedes cambiar el idioma en cualquier momento desde el menú 🌐
          </p>
        </div>
      </div>
    </div>
  );
}

export default function IdiomaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-slate-400 font-bold">Cargando...</div></div>}>
      <IdiomaPageInner />
    </Suspense>
  );
}
