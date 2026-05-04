import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/foro?temaSlug=fracciones
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const temaSlug = searchParams.get('temaSlug');
  if (!temaSlug) return NextResponse.json({ error: 'temaSlug requerido' }, { status: 400 });

  const tema = await prisma.tema.findUnique({ where: { slug: temaSlug } });
  if (!tema) return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 });

  const comentarios = await prisma.foroComentario.findMany({
    where: { temaId: tema.id },
    include: { user: { select: { nombre: true, rol: true } } },
    orderBy: { createdAt: 'asc' },
  });

  // Obtener la pregunta del foro para el idioma del usuario
  const contenido = await prisma.contenidoTema.findFirst({
    where: { temaId: tema.id, momento: 'VALORACION', idioma: session.idioma },
  });

  return NextResponse.json({ pregunta: contenido?.textoPreguntaForo ?? '', comentarios });
}

// POST /api/foro
// Body: { temaSlug: string, contenido: string, tipo?: string, pendienteSync?: boolean }
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { temaSlug, contenido, tipo = 'texto', pendienteSync = false } = body as {
    temaSlug: string;
    contenido: string;
    tipo?: string;
    pendienteSync?: boolean;
  };

  if (!temaSlug || !contenido?.trim()) {
    return NextResponse.json({ error: 'temaSlug y contenido requeridos' }, { status: 400 });
  }

  const tema = await prisma.tema.findUnique({ where: { slug: temaSlug } });
  if (!tema) return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 });

  const comentario = await prisma.foroComentario.create({
    data: {
      userId: session.userId,
      temaId: tema.id,
      contenido: contenido.trim(),
      tipo,
      pendienteSync,
    },
    include: { user: { select: { nombre: true, rol: true } } },
  });

  return NextResponse.json({ ok: true, comentario });
}
