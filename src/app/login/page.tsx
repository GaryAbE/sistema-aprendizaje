'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Delete, CircleAlert, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [shakePin, setShakePin] = useState(false);

  useEffect(() => {
    const hasSession = document.cookie.includes('ava_session');
    if (hasSession) router.push('/');
  }, [router]);

  async function handleLogin() {
    if (!usuario.trim() || pin.length < 4) {
      setError('Completa tu usuario y PIN de 4 dígitos');
      return;
    }
    setCargando(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario.trim().toLowerCase(), pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Usuario o PIN incorrecto');
        setShakePin(true);
        setPin('');
        setTimeout(() => setShakePin(false), 600);
        return;
      }
      // Always show language selector first on login
      const { rol } = data.user;
      const dest = rol === 'MAESTRO' ? '/maestro' : rol === 'PADRINO' ? '/tutoria' : rol === 'FAMILIA' ? '/familia' : '/mapa';
      router.push(`/idioma?next=${encodeURIComponent(dest)}`);
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  function pressPin(digit: string) {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');
      if (newPin.length === 4 && usuario.trim()) {
        // Auto-submit when PIN complete
        setTimeout(() => {
          setCargando(true);
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuario.trim().toLowerCase(), pin: newPin }),
          }).then(r => r.json()).then(data => {
            if (data.user) {
              const { rol } = data.user;
              const dest = rol === 'MAESTRO' ? '/maestro' : rol === 'PADRINO' ? '/tutoria' : rol === 'FAMILIA' ? '/familia' : '/mapa';
              router.push(`/idioma?next=${encodeURIComponent(dest)}`);
            } else {
              setError(data.error ?? 'Usuario o PIN incorrecto');
              setShakePin(true);
              setPin('');
              setTimeout(() => setShakePin(false), 600);
            }
          }).catch(() => setError('Error de conexión')).finally(() => setCargando(false));
        }, 300);
      }
    }
  }
  function deletePin() { setPin(p => p.slice(0, -1)); setError(''); }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff0f5 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #f43f5e 0%, transparent 70%)' }} />
      <div className="absolute top-[40%] right-[10%] w-[200px] h-[200px] rounded-full blur-2xl opacity-20" style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md px-4 py-8 flex flex-col items-center gap-8 anim-fadeInUp">
        {/* Logo / Header */}
        <div className="text-center space-y-4">
          <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto anim-flotar" style={{ boxShadow: '0 20px 60px rgba(99,102,241,0.25)' }}>
            <GraduationCap size={64} className="text-brand-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">AVA / EVA</h1>
            <p className="text-slate-500 font-medium mt-1">Sistema de Aprendizaje Comunitario</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 p-8 space-y-6" style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.12)' }}>
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={e => { setUsuario(e.target.value); setError(''); }}
              placeholder="ej: lucia.flores"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-xl font-bold text-slate-800 focus:outline-none focus:border-brand-primary transition-all"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          {/* PIN dots */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest">PIN de 4 dígitos</label>
            <div className={`flex items-center justify-center gap-4 py-3 ${shakePin ? 'animate-shake' : ''}`}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="transition-all duration-300"
                  style={{
                    width: i < pin.length ? '22px' : '18px',
                    height: i < pin.length ? '22px' : '18px',
                    borderRadius: '50%',
                    background: i < pin.length ? 'var(--color-primario, #6366f1)' : '#e2e8f0',
                    transform: i < pin.length ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: i < pin.length ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) => (
              <button
                key={i}
                type="button"
                className={`h-16 rounded-2xl font-black text-2xl transition-all active:scale-95 ${
                  key === '' ? 'invisible' :
                  key === '⌫' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' :
                  'bg-white border-2 border-slate-100 text-slate-800 hover:border-brand-primary/40 hover:bg-brand-primary/5 shadow-sm'
                }`}
                style={{ boxShadow: key !== '' && key !== '⌫' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none' }}
                onClick={() => key === '⌫' ? deletePin() : key !== '' ? pressPin(key) : null}
                disabled={key === '' || cargando}
              >
                {key === '⌫' ? <Delete size={24} className="mx-auto" /> : key}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 font-bold px-4 py-3 rounded-2xl anim-bounceIn">
              <CircleAlert size={20} className="shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-5 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-3 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: cargando ? 'none' : '0 8px 30px rgba(99,102,241,0.4)',
              opacity: cargando ? 0.8 : 1
            }}
            disabled={cargando || !usuario || pin.length < 4}
          >
            {cargando ? (
              <div className="flex gap-2">
                {[0,1,2].map(j => <div key={j} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />)}
              </div>
            ) : (
              <>
                <Sparkles size={24} />
                ¡Entrar!
                <ArrowRight size={24} />
              </>
            )}
          </button>

          <p className="text-center text-slate-400 text-sm font-medium">
            ¿No sabes tu usuario? <span className="font-bold text-brand-primary">Pide ayuda a tu maestra</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-8px); }
          30%, 60%, 90% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
