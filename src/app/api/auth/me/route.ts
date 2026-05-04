import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  // Trae info fresca del DB (por si cambió el idioma)
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      nombre: true,
      rol: true,
      grado: true,
      idioma: true,
      comunidad: true,
      padrinoId: true,
      padrino: { select: { nombre: true, usuario: true } },
    },
  });

  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  return NextResponse.json(user);
}
