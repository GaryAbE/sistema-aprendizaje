import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.rol !== 'PADRINO') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { produccionId, feedback } = await req.json();

    if (!produccionId || !feedback) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Verificar que la producción pertenezca a un ahijado del padrino
    const produccion = await prisma.produccion.findFirst({
      where: {
        id: produccionId,
        user: { padrinoId: session.userId }
      }
    });

    if (!produccion) {
      return NextResponse.json({ error: 'Producción no encontrada o no autorizada' }, { status: 404 });
    }

    await prisma.produccion.update({
      where: { id: produccionId },
      data: { feedbackPadrino: feedback }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Padrino feedback error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
