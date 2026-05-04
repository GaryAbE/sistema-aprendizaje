import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.rol !== 'MAESTRO') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { parentId, contenido, temaId } = await req.json();

    const respuesta = await prisma.foroComentario.create({
      data: {
        userId: session.userId,
        temaId,
        contenido,
        parentId,
        tipo: 'texto',
      },
      include: {
        user: { select: { nombre: true } }
      }
    });

    return NextResponse.json({ success: true, respuesta });
  } catch (error) {
    console.error('Error en respuesta foro:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
