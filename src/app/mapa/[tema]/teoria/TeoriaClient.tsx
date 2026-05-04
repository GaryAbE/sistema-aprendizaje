'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Volume2, 
  PlayCircle, 
  Map, 
  Ruler, 
  CircleAlert, 
  CheckCircle, 
  ChevronLeft,
  Check,
  ExternalLink
} from 'lucide-react';
import type { Idioma } from '@/lib/i18n';

type Recurso = {
  tipo: string;
  url: string;
  nombre: string;
};

type Contenido = {
  titulo: string;
  descripcion: string;
  urlAudioInstruccion: string | null;
  recursos: Recurso[];
};

type Props = {
  temaSlug: string;
  temaNombre: string;
  idioma: Idioma;
  contenido: Contenido | null;
  yaCompletada: boolean;
  labels: { instruccion: string; completar: string; momento: string };
};

export default function TeoriaClient({ temaSlug, contenido, yaCompletada, labels }: Props) {
  const router = useRouter();
  const [completando, setCompletando] = useState(false);
  const [error, setError] = useState('');

  async function handleCompletar() {
    setCompletando(true);
    setError('');
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temaSlug, momento: 'TEORIA' }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Error guardando progreso');
        return;
      }
      router.push(`/mapa?tema=${temaSlug}`);
    } catch {
      setError('Error de conexión');
    } finally {
      setCompletando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push(`/mapa?tema=${temaSlug}`)} className="btn-burbuja btn--secundario p-3">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
               <span className="badge bg-brand-info text-white px-3 py-1 text-xs">MOMENTO: {labels.momento}</span>
               {yaCompletada && <span className="badge bg-emerald-100 text-emerald-600 px-3 py-1 text-xs">COMPLETADO</span>}
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{contenido?.titulo || 'Material de Estudio'}</h1>
          </div>
        </header>
        <main className="space-y-8 pb-32">
          {/* Instrucciones de Voz */}
          {contenido?.urlAudioInstruccion && (
            <div className="card p-6 bg-brand-primary/5 border-2 border-brand-primary/10 flex items-center gap-6 anim-fadeInUp">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex-center text-brand-primary anim-flotar">
                <Volume2 size={32} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1">Guía por voz</p>
                <p className="font-bold text-slate-700 mb-2">Escucha la explicación de tu maestra:</p>
                <audio controls src={contenido.urlAudioInstruccion} className="w-full h-10" />
              </div>
            </div>
          )}

          {/* Cuerpo de la Teoría */}
          <div className="card p-0 overflow-hidden border-none shadow-2xl anim-fadeInUp">
            <div className="bg-brand-info p-6 text-white flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <BookOpen size={24} />
                  <span className="font-black uppercase tracking-widest text-sm">Contenido de Estudio</span>
               </div>
               <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase">Página 1</span>
            </div>
            
            <div className="p-10 card--cuaderno min-h-[400px]">
              <div className="prose prose-slate max-w-none">
                <p className="text-2xl leading-[1.6] text-slate-700 whitespace-pre-wrap font-medium">
                  {contenido?.descripcion || 'Tu maestra aún no ha subido la explicación para este tema. ¡Vuelve pronto!'}
                </p>
              </div>
            </div>
          </div>

          {/* Recursos Dinámicos - MÁS VISIBLES */}
          <div className="space-y-6 anim-fadeInUp">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                   <div className="p-2 bg-brand-info/10 rounded-lg text-brand-info"><Map size={24} /></div>
                   Materiales de Apoyo
                </h3>
                {contenido?.recursos && (
                   <span className="badge bg-slate-100 text-slate-500">{contenido.recursos.length} archivos</span>
                )}
             </div>

             {contenido?.recursos && contenido.recursos.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {contenido.recursos.map((rec, i) => (
                   <div key={i} className="card bg-white p-6 hover:border-brand-info/30 transition-all group">
                     <div className="flex items-start gap-4">
                       <div className={`w-14 h-14 rounded-2xl flex-center shrink-0 transition-transform group-hover:scale-110 ${
                         rec.tipo === 'video' ? 'bg-rose-100 text-rose-500' : 
                         rec.tipo === 'documento' ? 'bg-blue-100 text-blue-500' :
                         'bg-brand-success/10 text-brand-success'
                       }`}>
                         {rec.tipo === 'video' ? <PlayCircle size={28} /> : rec.tipo === 'documento' ? <Ruler size={28} /> : <BookOpen size={28} />}
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="font-black text-slate-800 text-lg leading-tight mb-1 truncate">{rec.nombre || 'Recurso Educativo'}</h4>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{rec.tipo}</p>
                         
                         <a 
                           href={rec.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 text-brand-info font-black text-sm hover:underline"
                         >
                           Ver Recurso <ExternalLink size={14} />
                         </a>
                       </div>
                     </div>

                     {/* Preview de Video si es Youtube */}
                     {rec.tipo === 'video' && rec.url.includes('youtube.com') && (
                       <div className="mt-6 aspect-video rounded-[2rem] overflow-hidden shadow-inner border-4 border-slate-50 bg-slate-100 relative group-hover:shadow-lg transition-all">
                         <iframe 
                           src={rec.url.replace('watch?v=', 'embed/')} 
                           className="w-full h-full"
                           allowFullScreen
                         />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             ) : (
                <div className="p-12 text-center bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hay videos o documentos adicionales aún</p>
                </div>
             )}
          </div>
        </main>

        {/* Footer Action */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-40">
           <div className="max-w-4xl mx-auto flex gap-4">
              <button 
                onClick={handleCompletar}
                disabled={completando}
                className={`btn-burbuja flex-1 py-5 text-2xl transition-all ${yaCompletada ? 'btn--secundario' : 'btn--primario shadow-2xl shadow-brand-primary/30'}`}
              >
                {completando ? 'Guardando...' : yaCompletada ? (
                  <><CheckCircle size={32} /> ¡Ya lo aprendí!</>
                ) : (
                  <><Check size={32} /> {labels.completar}</>
                )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
