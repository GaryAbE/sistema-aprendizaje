'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { t, type Idioma } from '@/lib/i18n';

type Props = {
  padrinoNombre: string;
  padrinoId: string;
  mensajesNoLeidos: number;
  idioma: Idioma;
};

export default function PadrinoFlotante({ padrinoNombre, mensajesNoLeidos, idioma }: Props) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function pedirAyuda() {
    if (!mensaje.trim()) return;
    setEnviando(true);
    try {
      // El receptor es el padrino; lo resuelve la API con la relación
      await fetch('/api/tutoria/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receptorId: '__padrino__', contenido: mensaje }),
      });
      setEnviado(true);
      setMensaje('');
      setTimeout(() => { setEnviado(false); setAbierto(false); }, 2000);
    } catch {
      // Sin conexión: guardar local
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        className="padrino-fab"
        onClick={() => setAbierto((o) => !o)}
        aria-label={t(idioma, 'tutoria_pedir_ayuda')}
        aria-expanded={abierto}
      >
        🤝
        {mensajesNoLeidos > 0 && (
          <span className="fab-badge" aria-label={`${mensajesNoLeidos} mensajes sin leer`}>
            {mensajesNoLeidos}
          </span>
        )}
      </button>

      {/* Popup */}
      {abierto && (
        <div className="padrino-popup" role="dialog" aria-label="Pedir ayuda al padrino">
          <div className="popup-header">
            <span>🤝 {padrinoNombre}</span>
            <button className="popup-close" onClick={() => setAbierto(false)} aria-label="Cerrar">✕</button>
          </div>

          {enviado ? (
            <p className="popup-enviado">¡Mensaje enviado! Tu padrino te responderá pronto 🌟</p>
          ) : (
            <>
              <textarea
                className="form-textarea popup-textarea"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="¿En qué necesitas ayuda?"
                rows={3}
              />
              <div className="popup-actions">
                <button
                  className="btn-primary btn-sm"
                  onClick={pedirAyuda}
                  disabled={enviando || !mensaje.trim()}
                >
                  {enviando ? '...' : '📤 Pedir ayuda'}
                </button>
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => router.push('/tutoria')}
                >
                  💬 Ver chat completo
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
