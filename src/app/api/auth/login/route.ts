import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createToken, setSessionCookie } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuario, pin } = body as { usuario: string; pin: string };

    if (!usuario || !pin) {
      return NextResponse.json({ error: 'Usuario y PIN requeridos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { usuario: usuario.trim().toLowerCase() },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        pin: true,
        rol: true,
        grado: true,
        idioma: true,
        comunidad: true,
        activo: true,
      },
    });

    if (!user || !user.activo) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    const pinValido = await bcrypt.compare(pin, user.pin);
    if (!pinValido) {
      return NextResponse.json({ error: 'PIN incorrecto' }, { status: 401 });
    }

    const token = await createToken({
      userId: user.id,
      nombre: user.nombre,
      rol: user.rol,
      grado: user.grado,
      idioma: user.idioma,
      comunidad: user.comunidad,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
        grado: user.grado,
        idioma: user.idioma,
        comunidad: user.comunidad,
      },
    });

    return setSessionCookie(res, token);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
