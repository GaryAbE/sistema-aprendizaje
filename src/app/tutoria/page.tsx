import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import TutoriaClient from './TutoriaClient';

export default async function TutoriaPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  // Permitir a padrinos, maestros y estudiantes (para ver conversación)
  if (!['PADRINO', 'MAESTRO', 'ESTUDIANTE'].includes(session.rol)) {
    redirect('/mapa');
  }

  let conversaciones: {
    userId: string;
    nombre: string;
    rol: string;
    mensajesNoLeidos: number;
    ultimoMensaje: string | null;
  }[] = [];

  if (session.rol === 'PADRINO' || session.rol === 'MAESTRO') {
    // Padrino: ver todos sus ahijados
    const ahijados = await prisma.user.findMany({
      where: { padrinoId: session.userId },
      select: {
        id: true,
        nombre: true,
        rol: true,
        mensajesRecibidos: {
          where: { emisorId: session.userId, leido: false },
          select: { id: true },
        },
      },
    });

    // Maestro: ver todos los estudiantes de su comunidad
    const estudiantes = session.rol === 'MAESTRO'
      ? await prisma.user.findMany({
          where: { comunidad: session.comunidad, rol: { in: ['ESTUDIANTE', 'PADRINO'] } },
          select: { id: true, nombre: true, rol: true },
        })
      : [];

    const all = session.rol === 'PADRINO' ? ahijados : estudiantes;

    conversaciones = await Promise.all(
      all.map(async (u) => {
        const ultimoMsg = await prisma.mensaje.findFirst({
          where: {
            OR: [
              { emisorId: session.userId, receptorId: u.id },
              { emisorId: u.id, receptorId: session.userId },
            ],
          },
          orderBy: { createdAt: 'desc' },
          select: { contenido: true },
        });
        const noLeidos = await prisma.mensaje.count({
          where: { emisorId: u.id, receptorId: session.userId, leido: false },
        });
        return {
          userId: u.id,
          nombre: u.nombre,
          rol: u.rol,
          mensajesNoLeidos: noLeidos,
          ultimoMensaje: ultimoMsg?.contenido ?? null,
        };
      })
    );
  }

  // Estudiante: ver conversación con su padrino
  let padrinoInfo: { id: string; nombre: string } | null = null;
  let mensajesConPadrino: {
    id: string;
    contenido: string;
    emisorId: string;
    createdAt: string;
    emisor: { nombre: string };
  }[] = [];

  if (session.rol === 'ESTUDIANTE') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { padrinoId: true, padrino: { select: { id: true, nombre: true } } },
    });
    padrinoInfo = user?.padrino ?? null;

    if (padrinoInfo) {
      const msgs = await prisma.mensaje.findMany({
        where: {
          OR: [
            { emisorId: session.userId, receptorId: padrinoInfo.id },
            { emisorId: padrinoInfo.id, receptorId: session.userId },
          ],
        },
        include: { emisor: { select: { nombre: true } } },
        orderBy: { createdAt: 'asc' },
        take: 50,
      });
      mensajesConPadrino = msgs.map((m) => ({
        id: m.id,
        contenido: m.contenido,
        emisorId: m.emisorId,
        createdAt: m.createdAt.toISOString(),
        emisor: m.emisor,
      }));
    }
  }

  // Alertas no leídas para padrino
  const alertas = session.rol === 'PADRINO'
    ? await prisma.alertaPadrino.findMany({
        where: { padrinoId: session.userId, leida: false },
        include: { ahijado: { select: { nombre: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
    : [];

  // Producciones de ahijados para el padrino
  const produccionesAhijados = session.rol === 'PADRINO'
    ? await prisma.produccion.findMany({
        where: {
          momento: 'PRODUCCION',
          user: { padrinoId: session.userId },
        },
        include: {
          user: { select: { nombre: true } },
          tema: { select: { nombre: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })
    : [];

  return (
    <TutoriaClient
      sessionUserId={session.userId}
      sessionRol={session.rol}
      sessionNombre={session.nombre}
      conversaciones={conversaciones}
      padrinoInfo={padrinoInfo}
      mensajesConPadrino={mensajesConPadrino}
      produccionesAhijados={produccionesAhijados.map((p) => ({
        id: p.id,
        userId: p.userId,
        userNombre: p.user.nombre,
        temaNombre: p.tema.nombre,
        tipo: p.tipo,
        urlArchivo: p.urlArchivo,
        reflexion: p.reflexion,
        autoEval: p.autoEval,
        feedbackPadrino: p.feedbackPadrino,
        createdAt: p.createdAt.toISOString(),
      }))}
      alertasIniciales={alertas.map((a) => ({
        id: a.id,
        tipo: a.tipo,
        mensaje: a.mensaje,
        createdAt: a.createdAt.toISOString(),
        ahijado: a.ahijado,
      }))}
    />
  );
}
