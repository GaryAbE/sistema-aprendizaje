import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST /api/sync
// Sincroniza producciones y comentarios pendientes (pendienteSync = true)
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { producciones = [], comentarios = [] } = body as {
    producciones: Array<{ id: string; [key: string]: unknown }>;
    comentarios: Array<{ id: string; [key: string]: unknown }>;
  };

  const syncedProducciones: string[] = [];
  const syncedComentarios: string[] = [];

  // Sync producciones pendientes
  for (const p of producciones) {
    await prisma.produccion.updateMany({
      where: { id: p.id, userId: session.userId },
      data: { pendienteSync: false },
    });
    syncedProducciones.push(p.id);
  }

  // Sync comentarios de foro pendientes
  for (const c of comentarios) {
    await prisma.foroComentario.updateMany({
      where: { id: c.id, userId: session.userId },
      data: { pendienteSync: false },
    });
    syncedComentarios.push(c.id);
  }

  // Devolver cualquier prod/comentario local pendiente del usuario
  const pendingProd = await prisma.produccion.findMany({
    where: { userId: session.userId, pendienteSync: true },
    select: { id: true, momento: true, tipo: true, createdAt: true },
  });

  return NextResponse.json({
    ok: true,
    synced: { producciones: syncedProducciones, comentarios: syncedComentarios },
    pending: { producciones: pendingProd },
  });
}
