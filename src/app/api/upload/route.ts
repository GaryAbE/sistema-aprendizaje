import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { saveUploadedFile } from '@/lib/uploads';
import { Momento } from '@prisma/client';

// POST /api/upload
// FormData: { archivo: File, temaSlug: string, momento: Momento, reflexion?: string, pendienteSync?: boolean }
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const formData = await request.formData();
    const archivo = formData.get('archivo') as File | null;
    const temaSlug = formData.get('temaSlug') as string;
    const momento = formData.get('momento') as Momento;
    const reflexion = formData.get('reflexion') as string | null;
    const pendienteSync = formData.get('pendienteSync') === 'true';

    if (!temaSlug || !momento) {
      return NextResponse.json({ error: 'temaSlug y momento requeridos' }, { status: 400 });
    }

    const tema = await prisma.tema.findUnique({ where: { slug: temaSlug } });
    if (!tema) return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 });

    let urlArchivo: string | null = null;
    let nombreArchivo: string | null = null;
    let tipo = 'texto';

    if (archivo && archivo.size > 0) {
      const saved = await saveUploadedFile(archivo, session.userId, temaSlug);
      if (!saved) {
        return NextResponse.json({ error: 'Tipo de archivo no permitido o demasiado grande' }, { status: 400 });
      }
      urlArchivo = saved.url;
      nombreArchivo = saved.nombreArchivo;
      tipo = saved.tipo;
    }

    const produccion = await prisma.produccion.create({
      data: {
        userId: session.userId,
        temaId: tema.id,
        momento,
        tipo,
        urlArchivo,
        nombreArchivo,
        reflexion,
        pendienteSync,
      },
    });

    return NextResponse.json({ ok: true, produccion });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error subiendo archivo' }, { status: 500 });
  }
}
