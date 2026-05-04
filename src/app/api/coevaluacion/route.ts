import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/coevaluacion?produccionId=xxx
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const produccionId = searchParams.get('produccionId');
  if (!produccionId) return NextResponse.json({ error: 'produccionId requerido' }, { status: 400 });

  const coevaluaciones = await prisma.coevaluacion.findMany({
    where: { produccionId },
    include: { autor: { select: { nombre: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(coevaluaciones);
}

// POST /api/coevaluacion
// Body: { produccionId, tipo, comentario? }
// tipo: "estrella1" | "estrella2" | "deseo" | "megusta"
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { produccionId, tipo, comentario } = body as {
    produccionId: string;
    tipo: string;
    comentario?: string;
  };

  if (!produccionId || !tipo) {
    return NextResponse.json({ error: 'produccionId y tipo requeridos' }, { status: 400 });
  }

  const produccion = await prisma.produccion.findUnique({
    where: { id: produccionId },
    select: { userId: true },
  });

  if (!produccion) return NextResponse.json({ error: 'Producción no encontrada' }, { status: 404 });
  if (produccion.userId === session.userId) {
    return NextResponse.json({ error: 'No puedes coevaluar tu propio trabajo' }, { status: 400 });
  }

  const coeval = await prisma.coevaluacion.upsert({
    where: { autorId_produccionId_tipo: { autorId: session.userId, produccionId, tipo } },
    update: { comentario },
    create: { autorId: session.userId, produccionId, tipo, comentario },
    include: { autor: { select: { nombre: true } } },
  });

  return NextResponse.json({ ok: true, coevaluacion: coeval });
}
