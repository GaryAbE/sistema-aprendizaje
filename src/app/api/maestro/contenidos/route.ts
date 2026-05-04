import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session || session.rol !== 'MAESTRO') {
      return NextResponse.json({ error: 'No autorizado o rol insuficiente' }, { status: 401 });
    }

    const body = await req.json();
    const { temaId, momento, idioma, titulo, descripcion, textoPreguntaForo, requiereEntrega, tipoActividad, tipoJuego, recursos, urlAudioInstruccion } = body;

    // Verificar si ya existe un contenido para este tema, momento e idioma
    const existente = await prisma.contenidoTema.findFirst({
      where: { temaId, momento, idioma }
    });

    const data = {
      titulo,
      descripcion,
      textoPreguntaForo,
      requiereEntrega: requiereEntrega ?? true,
      tipoActividad: tipoActividad ?? 'evidencia',
      tipoJuego,
      urlAudioInstruccion,
    };

    if (existente) {
      // Actualizar el existente y sus recursos
      const actualizado = await prisma.contenidoTema.update({
        where: { id: existente.id },
        data: {
          ...data,
          recursos: {
            deleteMany: {},
            create: recursos?.map((r: any) => ({
              tipo: r.tipo,
              url: r.url,
              nombre: r.nombre
            })) || []
          }
        },
        include: { recursos: true }
      });
      return NextResponse.json({ success: true, contenido: actualizado });
    } else {
      // Crear uno nuevo con sus recursos
      const nuevo = await prisma.contenidoTema.create({
        data: {
          temaId,
          momento,
          idioma,
          ...data,
          recursos: {
            create: recursos?.map((r: any) => ({
              tipo: r.tipo,
              url: r.url,
              nombre: r.nombre
            })) || []
          }
        },
        include: { recursos: true }
      });
      return NextResponse.json({ success: true, contenido: nuevo });
    }
  } catch (error) {
    console.error('Error guardando contenido:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const temaId = searchParams.get('temaId');
    const momento = searchParams.get('momento');
    const idioma = searchParams.get('idioma');

    const whereClause: any = {};
    if (temaId) whereClause.temaId = temaId;
    if (momento) whereClause.momento = momento;
    if (idioma) whereClause.idioma = idioma;

    const contenidos = await prisma.contenidoTema.findMany({
      where: whereClause,
      include: { recursos: true },
      orderBy: { orden: 'asc' }
    });

    return NextResponse.json({ success: true, contenidos });
  } catch (error) {
    console.error('Error obteniendo contenidos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
