'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Pencil, 
  Camera, 
  Mic, 
  Send, 
  Star, 
  Sprout, 
  Handshake, 
  CircleAlert, 
  CheckCircle, 
  ChevronLeft, 
  X, 
  Music, 
  PartyPopper, 
  Palette,
  Sparkles,
  Gamepad2,
  FileText,
  Video,
  PlayCircle,
  ExternalLink,
  Check,
  GraduationCap
} from 'lucide-react';
import JuegoInteractivo from '../juegos/JuegoInteractivo';
import type { Idioma } from '@/lib/i18n';

type ProduccionAnterior = {
  id: string;
  tipo: string;
  urlArchivo: string | null;
  reflexion: string | null;
  autoEval: string | null;
  feedbackMaestro: string | null;
  feedbackPadrino: string | null;
  createdAt: string;
};

type Recurso = {
  tipo: string;
  url: string;
  nombre: string;
};

type Props = {
  temaSlug: string;
  idioma: Idioma;
  titulo: string;
  descripcion: string;
  produccionesAnteriores: ProduccionAnterior[];
  yaCompletada: boolean;
  recursos?: Recurso[];
  labels: {
    momento: string;
    instruccion: string;
    reflexion: string;
    completar: string;
    evalTitulo: string;
    evalLogrado: string;
    evalProceso: string;
    evalAyuda: string;
  };
};

const AUTO_EVAL_OPTIONS = [
  { value: 'logrado', icon: Star, labelKey: 'evalLogrado', color: 'bg-amber-400', textColor: 'text-amber-900', iconColor: 'text-amber-600' },
  { value: 'proceso', icon: Sprout, labelKey: 'evalProceso', color: 'bg-emerald-400', textColor: 'text-emerald-900', iconColor: 'text-emerald-600' },
  { value: 'ayuda', icon: Handshake, labelKey: 'evalAyuda', color: 'bg-indigo-400', textColor: 'text-indigo-900', iconColor: 'text-indigo-600' },
];

export default function ProduccionClient({
  temaSlug, titulo, descripcion, produccionesAnteriores, yaCompletada, labels, requiereEntrega, tipoActividad, tipoJuego, recursos = [],
}: Props & { requiereEntrega?: boolean, tipoActividad?: string, tipoJuego?: string | null }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [reflexion, setReflexion] = useState('');
  const [autoEval, setAutoEval] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [etapa, setEtapa] = useState<'subir' | 'evaluar'>('subir');

  const reqEntrega = requiereEntrega ?? true;
  const tipoAct = tipoActividad ?? 'evidencia';

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setArchivo(f);
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function handleSubir() {
    if (tipoAct === 'evidencia' && reqEntrega && !archivo && !reflexion.trim()) {
      setError('Sube tu proyecto o escribe sobre lo que creaste');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('temaSlug', temaSlug);
      formData.append('momento', 'PRODUCCION');
      if (archivo) formData.append('archivo', archivo);
      if (reflexion) formData.append('reflexion', reflexion);

      if (archivo || reflexion.trim()) {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) {
          const d = await res.json();
          setError(d.error ?? 'Error subiendo proyecto');
          return;
        }
      }
      setEtapa('evaluar');
    } catch {
      setError('Error de conexión.');
    } finally {
      setEnviando(false);
    }
  }

  async function handleCompletar() {
    if (!autoEval) {
      setError('Selecciona cómo te fue antes de terminar');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await fetch('/api/produccion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produccionId: 'last', autoEval }),
      });

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temaSlug, momento: 'PRODUCCION' }),
      });
      if (res.ok) {
        router.push(`/mapa?tema=${temaSlug}`);
      } else {
        const d = await res.json();
        setError(d.error ?? 'Error completando el momento');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEnviando(false);
    }
  }

  if (tipoAct === 'juego' && etapa === 'subir') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-8">
            <button onClick={() => router.push(`/mapa?tema=${temaSlug}`)} className="btn-burbuja btn--secundario p-3">
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1">
              <span className="badge bg-brand-info text-white px-3 py-1 text-xs mb-1 uppercase">Momento: Producción (Juego)</span>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{titulo}</h1>
            </div>
          </header>
          <div className="card p-10 text-center">
             <p className="text-xl text-slate-600 mb-8">{descripcion}</p>
             <JuegoInteractivo temaSlug={temaSlug} tipoJuego={tipoJuego} onComplete={() => setEtapa('evaluar')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push(`/mapa?tema=${temaSlug}`)} className="btn-burbuja btn--secundario p-3">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <span className="badge bg-brand-accent text-white px-3 py-1 text-xs mb-1 uppercase">Momento: {labels.momento}</span>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{titulo}</h1>
          </div>
        </header>

        <main className="space-y-8">
          {/* ETAPA 1: SUBIR PROYECTO */}
          {etapa === 'subir' && (
            <>
              <div className="card p-8">
                <p className="text-xl text-slate-700 leading-relaxed mb-8">{descripcion}</p>
                
                {recursos.length > 0 && (
                  <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <PlayCircle className="text-brand-accent" /> Guía para tu proyecto
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recursos.map((rec, i) => (
                        <a key={i} href={rec.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-accent/30 transition-all group">
                          <div className={`w-12 h-12 rounded-xl flex-center ${rec.tipo === 'video' ? 'bg-rose-100 text-rose-500' : 'bg-brand-accent/10 text-brand-accent'}`}>
                            {rec.tipo === 'video' ? <Video size={20} /> : <FileText size={20} />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-slate-700 truncate group-hover:text-brand-accent transition-colors">{rec.nombre}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase">{rec.tipo}</p>
                          </div>
                          <ExternalLink size={18} className="text-slate-300 group-hover:text-brand-accent" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {reqEntrega ? (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <Palette className="text-brand-accent" /> ¡Manos a la obra!
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button type="button" className="btn-burbuja bg-white border-2 border-slate-100 p-8 flex flex-col items-center gap-3 hover:border-brand-info group" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-20 h-20 bg-brand-info/10 rounded-full flex-center text-brand-info group-hover:scale-110 transition-transform"><Camera size={40} /></div>
                        <span className="font-bold text-lg">Subir Foto o Video</span>
                      </button>
                      <button type="button" className="btn-burbuja bg-white border-2 border-slate-100 p-8 flex flex-col items-center gap-3 hover:border-brand-accent group" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex-center text-brand-accent group-hover:scale-110 transition-transform"><Mic size={40} /></div>
                        <span className="font-bold text-lg">Grabar Audio</span>
                      </button>
                    </div>

                    <input ref={fileInputRef} type="file" accept="image/*,audio/*,video/*" capture="environment" onChange={onFileChange} hidden />

                    {/* Preview */}
                    {(preview || archivo) && (
                      <div className="p-4 bg-white rounded-3xl shadow-lg border-2 border-brand-accent/20 relative anim-bounceIn max-w-md mx-auto">
                        <button onClick={() => { setArchivo(null); setPreview(null); }} className="absolute -top-3 -right-3 w-10 h-10 bg-rose-500 text-white rounded-full flex-center shadow-lg hover:scale-110 transition-transform z-10"><X size={20} /></button>
                        {preview ? <img src={preview} alt="Preview" className="w-full h-auto rounded-2xl" /> : (
                          <div className="flex items-center gap-4 p-4"><Music className="text-brand-accent" size={32} /><span className="font-bold text-slate-700 truncate">{archivo?.name}</span></div>
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="font-bold text-slate-600 block px-2">{labels.reflexion}</label>
                      <textarea className="w-full rounded-3xl border-2 border-slate-100 p-6 focus:border-brand-accent focus:ring-0 transition-all text-lg min-h-[150px]" value={reflexion} onChange={(e) => setReflexion(e.target.value)} placeholder="Cuéntanos qué aprendiste..." />
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center bg-brand-accent/5 rounded-3xl border-2 border-dashed border-brand-accent/20">
                     <PartyPopper size={48} className="mx-auto mb-4 text-brand-accent" />
                     <h3 className="text-xl font-bold text-slate-800">No se requiere entrega de archivo</h3>
                     <p className="text-slate-500">Reflexiona sobre lo aprendido y avanza a la autoevaluación.</p>
                  </div>
                )}
              </div>

              {error && <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl font-bold text-center">{error}</div>}

              <button onClick={handleSubir} disabled={enviando || (tipoAct === 'evidencia' && reqEntrega && !archivo && !reflexion.trim())} className="btn-burbuja btn--primario w-full py-6 text-xl shadow-2xl shadow-brand-accent/30 bg-brand-accent hover:bg-brand-accent/90">
                {enviando ? 'Cargando...' : <><Send size={28} /> {tipoAct === 'evidencia' ? labels.instruccion : 'Avanzar a Autoevaluación'}</>}
              </button>
            </>
          )}

          {/* ETAPA 2: AUTOEVALUACIÓN */}
          {etapa === 'evaluar' && (
            <div className="space-y-8 anim-fadeInUp">
              <div className="card p-12 text-center bg-white shadow-2xl border-t-8 border-brand-accent">
                <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex-center text-brand-accent mx-auto mb-6">
                   <Sparkles size={48} className="anim-flotar" />
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-4">{labels.evalTitulo}</h2>
                <p className="text-xl text-slate-500 mb-12">¿Cómo te sentiste realizando esta actividad?</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {AUTO_EVAL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAutoEval(opt.value)}
                      className={`relative flex flex-col items-center gap-4 p-8 rounded-[40px] border-4 transition-all hover:scale-105 ${autoEval === opt.value ? `border-brand-accent ${opt.color} shadow-2xl scale-110` : 'border-slate-100 bg-white hover:border-slate-200'}`}
                    >
                      <div className={`w-16 h-16 rounded-3xl flex-center ${autoEval === opt.value ? 'bg-white/30' : 'bg-slate-50'} ${autoEval === opt.value ? 'text-white' : opt.iconColor}`}>
                         <opt.icon size={40} strokeWidth={3} />
                      </div>
                      <span className={`font-black text-lg ${autoEval === opt.value ? 'text-white' : 'text-slate-700'}`}>
                        {labels[opt.labelKey as keyof typeof labels]}
                      </span>
                      {autoEval === opt.value && <div className="absolute -top-3 -right-3 w-8 h-8 bg-brand-accent text-white rounded-full flex-center"><Check size={20} strokeWidth={4} /></div>}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl font-bold text-center">{error}</div>}

              <button onClick={handleCompletar} disabled={enviando || !autoEval} className="btn-burbuja btn--primario w-full py-6 text-2xl shadow-2xl shadow-brand-accent/30 bg-brand-accent">
                {enviando ? 'Guardando...' : <><PartyPopper size={32} /> ¡Terminar mi Proyecto!</>}
              </button>
            </div>
          )}
          {/* SECCIÓN DE ENTREGAS ANTERIORES Y FEEDBACK */}
          {produccionesAnteriores.length > 0 && (
            <div className="space-y-6 mt-12 anim-fadeInUp">
               <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 px-2">
                  <Star className="text-amber-400" /> Mis Trabajos y Comentarios
               </h3>
               <div className="space-y-4">
                  {produccionesAnteriores.map((p) => (
                    <div key={p.id} className="card p-6 bg-white border-2 border-slate-50 hover:border-brand-accent/20 transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 rounded-xl flex-center text-slate-500">
                                {p.tipo === 'audio' ? <Mic size={20} /> : p.tipo === 'foto' ? <Camera size={20} /> : <FileText size={20} />}
                             </div>
                             <div>
                                <p className="font-black text-slate-800">Entrega del {new Date(p.createdAt).toLocaleDateString()}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.tipo}</p>
                             </div>
                          </div>
                          {p.autoEval && (
                             <span className="badge bg-brand-success/10 text-brand-success px-3 py-1 text-xs font-bold uppercase">
                                Autoevaluación: {p.autoEval}
                             </span>
                          )}
                       </div>

                       {p.reflexion && (
                          <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Mi Reflexión:</p>
                             <p className="text-slate-600 font-medium italic">"{p.reflexion}"</p>
                          </div>
                       )}

                       {/* Retroalimentación del Maestro */}
                       {p.feedbackMaestro && (
                         <div className="p-5 bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-3xl mb-3">
                            <div className="flex items-center gap-2 mb-2">
                               <GraduationCap size={16} className="text-brand-primary" />
                               <span className="text-xs font-black text-brand-primary uppercase tracking-widest">Respuesta de tu Maestra</span>
                            </div>
                            <p className="text-slate-700 font-bold text-lg leading-tight">"{p.feedbackMaestro}"</p>
                         </div>
                       )}

                       {/* Retroalimentación del Padrino */}
                       {p.feedbackPadrino && (
                         <div className="p-5 bg-brand-accent/5 border-l-4 border-brand-accent rounded-r-3xl">
                            <div className="flex items-center gap-2 mb-2">
                               <Sparkles size={16} className="text-brand-accent" />
                               <span className="text-xs font-black text-brand-accent uppercase tracking-widest">Nota de tu Padrino Digital</span>
                            </div>
                            <p className="text-slate-700 font-bold text-lg leading-tight">"{p.feedbackPadrino}"</p>
                         </div>
                       )}

                       {p.urlArchivo && (
                          <div className="mt-4">
                             <a href={p.urlArchivo} target="_blank" rel="noopener noreferrer" className="btn-burbuja btn--secundario py-2 px-4 text-xs inline-flex items-center gap-2">
                                <PlayCircle size={14} /> Ver mi archivo entregado
                             </a>
                          </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
