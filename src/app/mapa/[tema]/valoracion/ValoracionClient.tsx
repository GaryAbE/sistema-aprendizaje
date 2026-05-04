'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Handshake, 
  MessageSquare, 
  Send, 
  Star, 
  User, 
  Users, 
  Presentation, 
  CircleAlert, 
  CheckCircle, 
  ChevronLeft,
  Check,
  MessageCircle,
  MessageSquareQuote,
  Reply
} from 'lucide-react';
import type { Idioma } from '@/lib/i18n';

type Comentario = {
  id: string;
  contenido: string;
  tipo: string;
  createdAt: string;
  user: { nombre: string; rol: string };
  respuestas?: Comentario[];
};

type Props = {
  temaSlug: string;
  idioma: Idioma;
  pregunta: string;
  comentariosIniciales: Comentario[];
  userId: string;
  yaCompletada: boolean;
  labels: { momento: string; placeholder: string; comentarios: string; completar: string };
};

const ROL_STYLE: Record<string, { bg: string, text: string, icon: any }> = {
  ESTUDIANTE: { bg: 'bg-brand-primary/10', text: 'text-brand-primary', icon: User },
  MAESTRO: { bg: 'bg-rose-100', text: 'text-rose-600', icon: Presentation },
  PADRINO: { bg: 'bg-brand-accent/10', text: 'text-brand-accent', icon: Handshake },
  FAMILIA: { bg: 'bg-brand-info/10', text: 'text-brand-info', icon: Users },
};

export default function ValoracionClient({
  temaSlug, pregunta, comentariosIniciales, yaCompletada, labels,
}: Props) {
  const router = useRouter();
  const [comentarios, setComentarios] = useState<Comentario[]>(comentariosIniciales);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [completando, setCompletando] = useState(false);
  const [error, setError] = useState('');

  async function enviarComentario() {
    if (!texto.trim()) return;
    setEnviando(true);
    setError('');
    try {
      const res = await fetch('/api/foro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temaSlug, contenido: texto }),
      });
      const data = await res.json();
      if (res.ok) {
        setComentarios((prev) => [...prev, data.comentario]);
        setTexto('');
      } else {
        setError(data.error ?? 'Error enviando comentario');
      }
    } catch {
      setError('Sin conexión.');
    } finally {
      setEnviando(false);
    }
  }

  async function handleCompletar() {
    if (comentarios.length === 0) {
      setError('Escribe al menos un comentario antes de continuar');
      return;
    }
    setCompletando(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temaSlug, momento: 'VALORACION' }),
      });
      if (res.ok) router.push(`/mapa?tema=${temaSlug}`);
      else {
        const d = await res.json();
        setError(d.error ?? 'Error guardando progreso');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setCompletando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
      <div className="max-w-4xl mx-auto w-full">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push(`/mapa?tema=${temaSlug}`)} className="btn-burbuja btn--secundario p-3">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <span className="badge bg-brand-accent text-white px-3 py-1 text-xs mb-1 uppercase tracking-widest">Momento: {labels.momento}</span>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Reflexionemos Juntos</h1>
          </div>
        </header>

        <main className="space-y-8 pb-32">
          {/* Pregunta Orientadora */}
          <div className="card p-8 border-2 border-brand-primary/10 bg-white shadow-xl shadow-brand-primary/5">
             <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex-center text-brand-primary shrink-0">
                   <MessageSquareQuote size={32} />
                </div>
                <div>
                   <p className="text-slate-400 font-bold uppercase text-xs mb-1 tracking-widest">Pregunta para pensar:</p>
                   <p className="text-2xl font-bold text-slate-800 leading-tight">
                     {pregunta}
                   </p>
                </div>
             </div>
          </div>

          {/* Foro de Discusión */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 px-2 flex items-center gap-2">
               <MessageCircle className="text-brand-accent" /> {labels.comentarios}
            </h3>

            {comentarios.length === 0 ? (
              <div className="card p-20 text-center bg-white border-2 border-dashed border-slate-200">
                 <Star className="mx-auto mb-4 text-slate-200" size={60} />
                 <p className="text-xl font-bold text-slate-400">Sé el primero en compartir tu opinión</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comentarios.filter(c => !c.id.includes('resp')).map((c) => {
                  const style = ROL_STYLE[c.user.rol] ?? ROL_STYLE.ESTUDIANTE;
                  const Icon = style.icon;
                  
                  return (
                    <div key={c.id} className="space-y-4">
                      {/* Comentario Principal */}
                      <div className="card p-6 bg-white shadow-lg shadow-slate-200/50 border-l-8 border-brand-primary anim-fadeInUp">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex-center ${style.bg} ${style.text}`}>
                            <Icon size={20} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-slate-800">{c.user.nombre}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.user.rol}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-300">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-lg text-slate-700 leading-relaxed pl-2 border-l-2 border-slate-50 italic">
                          "{c.contenido}"
                        </p>
                      </div>

                      {/* Respuestas (Maestro, etc) */}
                      {c.respuestas?.map((resp) => {
                        const rStyle = ROL_STYLE[resp.user.rol] ?? ROL_STYLE.ESTUDIANTE;
                        const RIcon = rStyle.icon;
                        return (
                          <div key={resp.id} className="ml-12 card p-5 bg-brand-primary/5 border-2 border-brand-primary/10 shadow-sm anim-fadeInUp flex items-start gap-4">
                            <div className="mt-1"><Reply className="text-brand-primary" size={20} /></div>
                            <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-8 h-8 rounded-lg flex-center ${rStyle.bg} ${rStyle.text}`}>
                                    <RIcon size={16} />
                                  </div>
                                  <p className="font-bold text-slate-800 text-sm">{resp.user.nombre}</p>
                                  <span className="badge bg-brand-primary text-white text-[8px] px-2">RESPUESTA</span>
                               </div>
                               <p className="text-slate-600 font-medium">{resp.contenido}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Área de Escritura Flotante */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-6 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                className="w-full rounded-3xl border-2 border-slate-100 p-4 pr-16 focus:border-brand-primary focus:ring-0 transition-all text-lg min-h-[60px] max-h-[150px] shadow-inner"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={labels.placeholder}
                rows={1}
              />
              <button
                onClick={enviarComentario}
                disabled={enviando || !texto.trim()}
                className="absolute right-3 bottom-3 w-10 h-10 bg-brand-primary text-white rounded-2xl flex-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={20} fill="currentColor" />
              </button>
            </div>
            
            <button
              onClick={handleCompletar}
              disabled={completando || comentarios.length === 0}
              className={`btn-burbuja py-4 px-8 font-black text-lg h-[60px] ${yaCompletada ? 'btn--secundario' : 'btn--primario shadow-lg shadow-brand-primary/20'}`}
            >
              {completando ? '...' : yaCompletada ? <CheckCircle /> : <Check />}
            </button>
          </div>
          {error && <p className="text-rose-500 text-xs font-bold mt-2 px-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
