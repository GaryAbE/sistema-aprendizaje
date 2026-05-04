import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getProgresoCompleto, completarMomento } from '@/lib/progress';
import { Momento } from '@prisma/client';

// GET /api/progress?temaSlug=fracciones
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const temaSlug = searchParams.get('temaSlug');
  if (!temaSlug) return NextResponse.json({ error: 'temaSlug requerido' }, { status: 400 });

  const tema = await prisma.tema.findUnique({ where: { slug: temaSlug } });
  if (!tema) return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 });

  const progreso = await getProgresoCompleto(session.userId, tema.id);
  return NextResponse.json({ tema, progreso });
}

// POST /api/progress
// Body: { temaSlug: string, momento: Momento }
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { temaSlug, momento } = body as { temaSlug: string; momento: Momento };

  if (!temaSlug || !momento) {
    return NextResponse.json({ error: 'temaSlug y momento requeridos' }, { status: 400 });
  }

  const tema = await prisma.tema.findUnique({ where: { slug: temaSlug } });
  if (!tema) return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 });

  try {
    await completarMomento(session.userId, tema.id, momento);
    const progreso = await getProgresoCompleto(session.userId, tema.id);
    return NextResponse.json({ ok: true, progreso });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
