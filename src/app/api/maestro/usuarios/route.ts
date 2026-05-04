import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { Rol } from '@prisma/client';

// GET /api/maestro/usuarios - lista todos los usuarios de la comunidad del maestro
export async function GET() {
  const session = await getSession();
  if (!session || session.rol !== 'MAESTRO') {
    return NextResponse.json({ error: 'Solo maestros' }, { status: 403 });
  }

  const usuarios = await prisma.user.findMany({
    where: { comunidad: session.comunidad },
    select: {
      id: true,
      nombre: true,
      usuario: true,
      rol: true,
      grado: true,
      idioma: true,
      activo: true,
      padrinoId: true,
      padrino: { select: { nombre: true } },
      progresos: {
        select: { momento: true, completado: true, tema: { select: { nombre: true } } },
      },
    },
    orderBy: [{ rol: 'asc' }, { nombre: 'asc' }],
  });

  return NextResponse.json(usuarios);
}

// POST /api/maestro/usuarios - crear nuevo usuario
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.rol !== 'MAESTRO') {
    return NextResponse.json({ error: 'Solo maestros' }, { status: 403 });
  }

  const body = await request.json();
  const { nombre, usuario, pin, rol, grado, idioma, padrinoId } = body as {
    nombre: string;
    usuario: string;
    pin: string;
    rol: Rol;
    grado: number;
    idioma: string;
    padrinoId?: string;
  };

  if (!nombre || !usuario || !pin || !rol || !grado) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  if (pin.length < 4) {
    return NextResponse.json({ error: 'PIN debe tener al menos 4 caracteres' }, { status: 400 });
  }

  const existe = await prisma.user.findUnique({ where: { usuario: usuario.toLowerCase() } });
  if (existe) {
    return NextResponse.json({ error: 'Ese nombre de usuario ya existe' }, { status: 400 });
  }

  const hashedPin = await bcrypt.hash(pin, 10);

  const newUser = await prisma.user.create({
    data: {
      nombre,
      usuario: usuario.trim().toLowerCase(),
      pin: hashedPin,
      rol,
      grado,
      idioma: idioma ?? 'es',
      comunidad: session.comunidad,
      padrinoId: padrinoId || null,
    },
  });

  // Inicializar progreso en todos los temas activos del grado
  const temas = await prisma.tema.findMany({ where: { grado, activo: true } });
  for (const tema of temas) {
    await prisma.progreso.create({
      data: { userId: newUser.id, temaId: tema.id, momento: 'PRACTICA' },
    });
  }

  return NextResponse.json({
    ok: true,
    user: { id: newUser.id, nombre: newUser.nombre, usuario: newUser.usuario },
  });
}

// PATCH /api/maestro/usuarios - actualizar usuario (asignar padrino, desactivar, etc.)
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || session.rol !== 'MAESTRO') {
    return NextResponse.json({ error: 'Solo maestros' }, { status: 403 });
  }

  const body = await request.json();
  const { userId, padrinoId, activo, idioma } = body as {
    userId: string;
    padrinoId?: string;
    activo?: boolean;
    idioma?: string;
  };

  if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(padrinoId !== undefined && { padrinoId: padrinoId || null }),
      ...(activo !== undefined && { activo }),
      ...(idioma && { idioma }),
    },
    select: { id: true, nombre: true, padrinoId: true, activo: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
