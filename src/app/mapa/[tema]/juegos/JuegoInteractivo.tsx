'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Star, CheckCircle2, XCircle, ArrowRight, PartyPopper,
  Trophy, Check, Puzzle, Hash, Shapes, BookOpen, Zap
} from 'lucide-react';

type Question = {
  text: string;
  options: string[];
  correct: number;
};

// ── BANCOS DE PREGUNTAS ────────────────────────────────────────────────
const BANCO_SUMA: Question[] = [
  { text: '¿Cuánto es 5 + 3?', options: ['6', '8', '7', '9'], correct: 1 },
  { text: 'Si tengo 4 manzanas y me regalan 2, ¿cuántas tengo?', options: ['5', '6', '8', '4'], correct: 1 },
  { text: '¿Cuánto es 10 + 5?', options: ['12', '14', '15', '20'], correct: 2 },
  { text: '¿Cuánto es 7 + 8?', options: ['14', '15', '13', '16'], correct: 1 },
  { text: 'Hay 3 gallinas y llegan 6 más. ¿Cuántas hay?', options: ['8', '9', '7', '10'], correct: 1 },
];
const BANCO_RESTA: Question[] = [
  { text: '¿Cuánto es 8 - 3?', options: ['5', '4', '6', '3'], correct: 0 },
  { text: 'Tengo 10 caramelos y me como 4. ¿Cuántos quedan?', options: ['5', '6', '7', '4'], correct: 1 },
  { text: '¿Cuánto es 15 - 5?', options: ['10', '5', '8', '11'], correct: 0 },
  { text: '¿Cuánto es 12 - 7?', options: ['4', '5', '6', '3'], correct: 1 },
  { text: 'Tenía 20 bolitas y perdí 9. ¿Cuántas me quedan?', options: ['10', '11', '12', '9'], correct: 1 },
];
const BANCO_FRACCIONES: Question[] = [
  { text: '¿Qué fracción representa la mitad?', options: ['1/4', '1/3', '1/2', '2/3'], correct: 2 },
  { text: 'Si divides una pizza en 4 y tomas 1, ¿qué fracción tienes?', options: ['1/4', '1/2', '3/4', '1/8'], correct: 0 },
  { text: '¿Cuánto es 1/2 + 1/2?', options: ['1/4', '1', '2', '1/3'], correct: 1 },
  { text: 'Un pastel dividido en 8 partes. Comes 3. ¿Qué fracción comiste?', options: ['3/8', '3/5', '5/8', '1/3'], correct: 0 },
  { text: '¿Cuál fracción es mayor: 1/2 ó 1/4?', options: ['1/4', '1/2', 'Son iguales', 'No se puede saber'], correct: 1 },
];
const BANCO_MULTIPLICACION: Question[] = [
  { text: '¿Cuánto es 3 × 4?', options: ['10', '11', '12', '9'], correct: 2 },
  { text: '5 × 5 = ?', options: ['20', '25', '30', '15'], correct: 1 },
  { text: 'Hay 6 filas de 3 sillas. ¿Cuántas sillas hay en total?', options: ['15', '18', '16', '12'], correct: 1 },
  { text: '¿Cuánto es 7 × 2?', options: ['12', '13', '14', '15'], correct: 2 },
  { text: '4 × 8 = ?', options: ['28', '30', '32', '36'], correct: 2 },
];
const BANCO_LECTURA: Question[] = [
  { text: '"El sol sale por el este". ¿Por dónde sale el sol?', options: ['Oeste', 'Norte', 'Este', 'Sur'], correct: 2 },
  { text: '¿Cuántas sílabas tiene la palabra "ma-ri-po-sa"?', options: ['3', '4', '5', '6'], correct: 1 },
  { text: '¿Cuál es el plural de "árbol"?', options: ['Árbolos', 'Árboles', 'Arboles', 'Árbol'], correct: 1 },
  { text: 'Completa: "El cielo es de color ___"', options: ['verde', 'rojo', 'azul', 'amarillo'], correct: 2 },
];
const BANCO_NATURALEZA: Question[] = [
  { text: '¿Qué necesita una planta para crecer?', options: ['Piedras', 'Agua y sol', 'Hielo', 'Oscuridad'], correct: 1 },
  { text: '¿Cuál de estos es un animal?', options: ['Rosa', 'Perro', 'Pino', 'Nube'], correct: 1 },
  { text: '¿Cuántas patas tiene un insecto?', options: ['4', '6', '8', '2'], correct: 1 },
  { text: '¿Qué animal pone huevos?', options: ['Vaca', 'Gallina', 'Gato', 'Perro'], correct: 1 },
];

function pickQuestions(slug: string, tipo: string | null | undefined): Question[] {
  if (tipo === 'divide-pan') return [];
  const src =
    slug.includes('fraccion') ? BANCO_FRACCIONES :
    slug.includes('suma')     ? BANCO_SUMA :
    slug.includes('resta')    ? BANCO_RESTA :
    slug.includes('multiplic')? BANCO_MULTIPLICACION :
    slug.includes('lectura')  ? BANCO_LECTURA :
    slug.includes('natural')  ? BANCO_NATURALEZA :
    tipo === 'quiz-multiplicacion' ? BANCO_MULTIPLICACION :
    tipo === 'quiz-lectura'   ? BANCO_LECTURA :
    BANCO_SUMA;
  // Shuffle and pick 4
  return [...src].sort(() => Math.random() - 0.5).slice(0, 4);
}

// ── JUEGO EMPAREJAMIENTO ─────────────────────────────────────────────
const PARES = [
  { left: '1/2', right: '0.5' },
  { left: '1/4', right: '0.25' },
  { left: '3/4', right: '0.75' },
  { left: '1/3', right: '≈0.33' },
];

function JuegoEmparejamiento({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);

  const lefts = PARES.map(p => p.left);
  const rights = [...PARES.map(p => p.right)].sort(() => Math.random() - 0.5);

  function tap(id: string, side: 'L' | 'R') {
    const key = `${side}:${id}`;
    if (matched.includes(id)) return;
    if (!selected) { setSelected(key); return; }
    const [selSide, selId] = selected.split(':');
    if (selSide === side) { setSelected(key); return; }

    const leftVal  = side === 'L' ? id : selId;
    const rightVal = side === 'R' ? id : selId;
    const ok = PARES.some(p => p.left === leftVal && p.right === rightVal);
    if (ok) {
      const newMatched = [...matched, leftVal, rightVal];
      setMatched(newMatched);
      setSelected(null);
      if (newMatched.length === PARES.length * 2) setTimeout(onComplete, 800);
    } else {
      setWrong(key);
      setTimeout(() => { setWrong(null); setSelected(null); }, 800);
    }
  }

  const isSelected = (id: string, side: 'L' | 'R') => selected === `${side}:${id}`;
  const isMatched  = (id: string) => matched.includes(id);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-slate-800 text-center">¡Empareja Fracciones y Decimales!</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {lefts.map(l => (
            <button key={l} onClick={() => tap(l, 'L')}
              className={`w-full p-4 rounded-2xl font-black text-xl border-2 transition-all ${
                isMatched(l) ? 'bg-emerald-100 border-emerald-300 text-emerald-700 opacity-60' :
                isSelected(l, 'L') ? 'bg-brand-primary border-brand-primary text-white scale-105 shadow-lg' :
                wrong === `L:${l}` ? 'bg-rose-100 border-rose-300 text-rose-600' :
                'bg-white border-slate-200 text-slate-700 hover:border-brand-primary/40'
              }`}>{l}</button>
          ))}
        </div>
        <div className="space-y-3">
          {rights.map(r => (
            <button key={r} onClick={() => tap(r, 'R')}
              className={`w-full p-4 rounded-2xl font-black text-xl border-2 transition-all ${
                isMatched(r) ? 'bg-emerald-100 border-emerald-300 text-emerald-700 opacity-60' :
                isSelected(r, 'R') ? 'bg-brand-accent border-brand-accent text-white scale-105 shadow-lg' :
                wrong === `R:${r}` ? 'bg-rose-100 border-rose-300 text-rose-600' :
                'bg-white border-slate-200 text-slate-700 hover:border-brand-accent/40'
              }`}>{r}</button>
          ))}
        </div>
      </div>
      <p className="text-center text-slate-400 text-sm font-bold">{matched.length / 2} / {PARES.length} pares encontrados</p>
    </div>
  );
}

// ── JUEGO ORDENA LOS NÚMEROS ─────────────────────────────────────────
const SERIES = [
  [2, 4, 6, 8, 10],
  [1, 3, 5, 7, 9],
  [5, 10, 15, 20, 25],
  [3, 6, 9, 12, 15],
];

function JuegoOrdenar({ onComplete }: { onComplete: () => void }) {
  const serie = SERIES[Math.floor(Math.random() * SERIES.length)];
  const shuffled = [...serie].sort(() => Math.random() - 0.5);
  const [order, setOrder] = useState<number[]>(shuffled);
  const [checking, setChecking] = useState(false);
  const [ok, setOk] = useState(false);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const n = [...order];
    [n[i], n[j]] = [n[j], n[i]];
    setOrder(n);
  }

  function check() {
    setChecking(true);
    if (order.every((v, i) => v === serie[i])) {
      setOk(true);
      setTimeout(onComplete, 1000);
    } else {
      setTimeout(() => setChecking(false), 800);
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-slate-800 text-center">¡Ordena los números de menor a mayor!</h3>
      <div className="flex gap-3 justify-center flex-wrap">
        {order.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-300 hover:text-brand-primary disabled:opacity-20 font-black">▲</button>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-2 transition-all ${
              ok ? 'bg-emerald-100 border-emerald-300 text-emerald-700' :
              checking && !ok ? 'bg-rose-50 border-rose-200' :
              'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>{n}</div>
            <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="text-slate-300 hover:text-brand-primary disabled:opacity-20 font-black">▼</button>
          </div>
        ))}
      </div>
      <button onClick={check} disabled={ok}
        className="btn-burbuja btn--primario w-full py-4 text-lg font-black">
        {ok ? '✓ ¡Correcto!' : 'Verificar orden'}
      </button>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────
export default function JuegoInteractivo({ temaSlug, tipoJuego, onComplete }: {
  temaSlug: string;
  tipoJuego?: string | null;
  onComplete?: () => void;
}) {
  const router = useRouter();
  const [gameMode, setGameMode] = useState<'quiz' | 'pan' | 'emparejar' | 'ordenar'>('quiz');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  // Pan game
  const [panParts] = useState(4);
  const [selectedPanParts, setSelectedPanParts] = useState<number[]>([]);
  const [targetParts] = useState(() => Math.floor(Math.random() * 3) + 1);

  useEffect(() => {
    if (tipoJuego === 'divide-pan')  { setGameMode('pan'); return; }
    if (tipoJuego === 'emparejar')   { setGameMode('emparejar'); return; }
    if (tipoJuego === 'ordenar')     { setGameMode('ordenar'); return; }
    setGameMode('quiz');
    setQuestions(pickQuestions(temaSlug, tipoJuego));
  }, [temaSlug, tipoJuego]);

  const done = () => { if (onComplete) onComplete(); else router.push(`/mapa?tema=${temaSlug}`); };

  const handleSelect = (idx: number) => {
    if (showResult || !questions[currentIdx]) return;
    setSelectedOpt(idx);
    setShowResult(true);
    if (idx === questions[currentIdx].correct) setScore(s => s + 1);
    setTimeout(() => {
      if (currentIdx + 1 < questions.length) { setCurrentIdx(c => c + 1); setSelectedOpt(null); setShowResult(false); }
      else setGameFinished(true);
    }, 1500);
  };

  const verifyPan = () => {
    if (selectedPanParts.length === targetParts) { setScore(1); setGameFinished(true); }
    else alert('¡Vuelve a intentarlo! Selecciona la cantidad correcta de partes.');
  };

  // ── PANTALLA FINAL ──────────────────────────────────────────────
  if (gameFinished) {
    const stars = gameMode === 'quiz' ? Math.ceil((score / questions.length) * 3) : 3;
    return (
      <div className="card text-center p-12 bg-white shadow-2xl border-b-8 border-brand-accent anim-fadeInUp">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
          <Trophy size={48} className="anim-flotar" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-2">¡Increíble Trabajo!</h1>
        <p className="text-xl text-slate-500 mb-8">
          {gameMode === 'quiz' ? `Lograste ${score} de ${questions.length} respuestas correctas.` : '¡Lo lograste perfectamente!'}
        </p>
        <div className="flex justify-center gap-3 mb-10">
          {[...Array(stars)].map((_, i) => (
            <Star key={i} size={48} className="text-amber-400 fill-amber-400 anim-bounceIn" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <button className="btn-burbuja btn--primario w-full py-5 text-xl" onClick={done}>
          Terminar y Avanzar <ArrowRight size={24} className="ml-2 inline" />
        </button>
      </div>
    );
  }

  // ── MODO EMPAREJAR ──────────────────────────────────────────────
  if (gameMode === 'emparejar') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 bg-white shadow-xl">
          <JuegoEmparejamiento onComplete={() => setGameFinished(true)} />
        </div>
      </div>
    );
  }

  // ── MODO ORDENAR ────────────────────────────────────────────────
  if (gameMode === 'ordenar') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 bg-white shadow-xl">
          <JuegoOrdenar onComplete={() => setGameFinished(true)} />
        </div>
      </div>
    );
  }

  // ── MODO DIVIDE EL PAN ──────────────────────────────────────────
  if (gameMode === 'pan') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="card p-8 bg-white border-2 border-brand-info/20 shadow-xl text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
            <PartyPopper className="text-brand-info" /> ¡Divide el Pan!
          </h2>
          <p className="text-xl text-slate-600 mb-8 font-bold">
            Selecciona <span className="text-brand-info text-3xl mx-1">{targetParts}</span> de <span className="text-slate-400">{panParts}</span> partes para formar la fracción <span className="text-brand-primary">{targetParts}/{panParts}</span>.
          </p>
          <div className="flex justify-center mb-10">
            <div className="grid grid-cols-2 gap-4 w-64 h-64">
              {[...Array(panParts)].map((_, i) => (
                <button key={i}
                  onClick={() => setSelectedPanParts(prev => prev.includes(i) ? prev.filter(p => p !== i) : [...prev, i])}
                  className={`w-full h-full rounded-2xl border-4 transition-all duration-300 active:scale-95 ${selectedPanParts.includes(i) ? 'bg-brand-primary border-brand-primary shadow-lg scale-105' : 'bg-amber-100 border-amber-200 hover:border-amber-300'}`}
                >
                  {selectedPanParts.includes(i) && <Check className="text-white mx-auto" size={40} strokeWidth={4} />}
                </button>
              ))}
            </div>
          </div>
          <button onClick={verifyPan} className="btn-burbuja btn--primario w-full py-4 text-xl bg-brand-info">
            Verificar mi Respuesta
          </button>
        </div>
      </div>
    );
  }

  // ── MODO QUIZ ───────────────────────────────────────────────────
  const currentQ = questions[currentIdx];
  if (!currentQ) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-info/10 rounded-2xl flex items-center justify-center text-brand-info font-black text-xl">{currentIdx + 1}</div>
          <span className="font-bold text-slate-400 uppercase tracking-widest text-sm">Pregunta de {questions.length}</span>
        </div>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full transition-all ${i <= currentIdx ? 'bg-brand-info' : 'bg-slate-200'}`} />
          ))}
        </div>
      </header>

      <main className="card p-10 bg-white border-2 border-slate-100 shadow-xl">
        <h3 className="text-3xl font-black text-slate-800 text-center mb-10 leading-tight">{currentQ.text}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = idx === currentQ.correct;
            const isSelected = idx === selectedOpt;
            let cls = 'bg-white border-2 border-slate-100 hover:border-brand-info hover:bg-slate-50 text-slate-700';
            let Icon = null as any;
            if (showResult) {
              if (isCorrect) { cls = 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105'; Icon = CheckCircle2; }
              else if (isSelected) { cls = 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200'; Icon = XCircle; }
              else { cls = 'bg-slate-50 border-slate-100 text-slate-300 opacity-50'; }
            }
            return (
              <button key={idx} disabled={showResult} onClick={() => handleSelect(idx)}
                className={`btn-burbuja py-6 text-2xl font-black transition-all flex items-center justify-center gap-3 ${cls}`}>
                {Icon && <Icon size={28} className="anim-bounceIn" />}
                {opt}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
