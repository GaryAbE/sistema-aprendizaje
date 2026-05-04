import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/tutoria/mensajes?conUserId=xxx
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const conUserId = searchParams.get('conUserId');

  let where: Record<string, unknown>;

  if (conUserId) {
    // Conversación entre dos usuarios específicos
    where = {
      OR: [
        { emisorId: session.userId, receptorId: conUserId },
        { emisorId: conUserId, receptorId: session.userId },
      ],
    };
  } else {
    // Todos los mensajes del usuario
    where = {
      OR: [{ emisorId: session.userId }, { receptorId: session.userId }],
    };
  }

  const mensajes = await prisma.mensaje.findMany({
    where,
    include: {
      emisor: { select: { id: true, nombre: true, rol: true } },
      receptor: { select: { id: true, nombre: true, rol: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Marcar como leídos los mensajes recibidos
  await prisma.mensaje.updateMany({
    where: { receptorId: session.userId, leido: false },
    data: { leido: true },
  });

  // Alertas del padrino (si es padrino)
  let alertas: unknown[] = [];
  if (session.rol === 'PADRINO') {
    alertas = await prisma.alertaPadrino.findMany({
      where: { padrinoId: session.userId, leida: false },
      include: { ahijado: { select: { nombre: true } } },
      orderBy: { createdAt: 'desc' },
    });
    await prisma.alertaPadrino.updateMany({
      where: { padrinoId: session.userId, leida: false },
      data: { leida: true },
    });
  }

  return NextResponse.json({ mensajes, alertas });
}

// POST /api/tutoria/mensajes
// Body: { receptorId, contenido, tipo? }
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { receptorId, contenido, tipo = 'texto' } = body as {
    receptorId: string;
    contenido: string;
    tipo?: string;
  };

  if (!receptorId || !contenido?.trim()) {
    return NextResponse.json({ error: 'receptorId y contenido requeridos' }, { status: 400 });
  }

  // Verificar que hay relación padrino-ahijado
  const esRelacion = await prisma.user.findFirst({
    where: {
      OR: [
        { id: session.userId, padrinoId: receptorId },
        { id: receptorId, padrinoId: session.userId },
      ],
    },
  });

  // Maestros pueden escribir a cualquiera
  if (!esRelacion && session.rol !== 'MAESTRO') {
    return NextResponse.json({ error: 'Sin relación de tutoría' }, { status: 403 });
  }

  const mensaje = await prisma.mensaje.create({
    data: {
      emisorId: session.userId,
      receptorId,
      contenido: contenido.trim(),
      tipo,
    },
    include: {
      emisor: { select: { id: true, nombre: true, rol: true } },
      receptor: { select: { id: true, nombre: true, rol: true } },
    },
  });

  // Crear alerta si el padrino escribe al ahijado (o viceversa)
  const ahijado = await prisma.user.findFirst({
    where: { id: receptorId, padrinoId: session.userId },
  });
  if (!ahijado) {
    // El receptor es el padrino, avisar que el ahijado pidió ayuda
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { padrinoId: true, nombre: true },
    });
    if (user?.padrinoId === receptorId) {
      await prisma.alertaPadrino.create({
        data: {
          ahijadoId: session.userId,
          padrinoId: receptorId,
          tipo: 'duda',
          mensaje: `${user.nombre} te envió un mensaje pidiendo ayuda`,
        },
      });
    }
  }

  return NextResponse.json({ ok: true, mensaje });
}
