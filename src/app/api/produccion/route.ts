import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/produccion?temaSlug=fracciones&userId=xxx (para portafolio)
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const temaSlug = searchParams.get('temaSlug');
  const targetUserId = searchParams.get('userId') ?? session.userId;

  // Solo maestros y padrinos pueden ver producciones de otros
  if (targetUserId !== session.userId && !['MAESTRO', 'PADRINO'].includes(session.rol)) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 });
  }

  const where: Record<string, unknown> = { userId: targetUserId };
  if (temaSlug) {
    const tema = await prisma.tema.findUnique({ where: { slug: temaSlug } });
    if (tema) where.temaId = tema.id;
  }

  const producciones = await prisma.produccion.findMany({
    where,
    include: {
      user: { select: { nombre: true } },
      tema: { select: { nombre: true, slug: true } },
      coevaluaciones: {
        include: { autor: { select: { nombre: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(producciones);
}

// PATCH /api/produccion/:id - para feedback de maestro/padrino
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { produccionId, feedbackMaestro, feedbackPadrino, autoEval } = body as {
    produccionId: string;
    feedbackMaestro?: string;
    feedbackPadrino?: string;
    autoEval?: string;
  };

  if (!produccionId) return NextResponse.json({ error: 'produccionId requerido' }, { status: 400 });

  let idToUpdate = produccionId;
  if (produccionId === 'last') {
    const last = await prisma.produccion.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });
    if (!last) return NextResponse.json({ error: 'No hay producciones previas' }, { status: 404 });
    idToUpdate = last.id;
  }

  const produccion = await prisma.produccion.findUnique({ where: { id: idToUpdate } });
  if (!produccion) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  // Validar permisos
  if (autoEval && produccion.userId !== session.userId) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 });
  }
  if (feedbackMaestro && session.rol !== 'MAESTRO') {
    return NextResponse.json({ error: 'Solo maestros' }, { status: 403 });
  }
  if (feedbackPadrino && session.rol !== 'PADRINO') {
    return NextResponse.json({ error: 'Solo padrinos' }, { status: 403 });
  }

  const updated = await prisma.produccion.update({
    where: { id: idToUpdate },
    data: {
      ...(autoEval && { autoEval, calificadoAt: new Date() }),
      ...(feedbackMaestro && { feedbackMaestro }),
      ...(feedbackPadrino && { feedbackPadrino }),
    },
  });

  return NextResponse.json({ ok: true, produccion: updated });
}
