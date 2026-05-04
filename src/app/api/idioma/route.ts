import { NextRequest, NextResponse } from 'next/server';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST /api/idioma
// Body: { idioma: 'es' | 'ay' | 'qu' | 'gu' }
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { idioma } = body as { idioma: string };

  const IDIOMAS_VALIDOS = ['es', 'ay', 'qu', 'gu'];
  if (!IDIOMAS_VALIDOS.includes(idioma)) {
    return NextResponse.json({ error: 'Idioma no válido' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { idioma },
  });

  // Refrescar token con nuevo idioma
  const newToken = await createToken({ ...session, idioma });
  const res = NextResponse.json({ ok: true, idioma });
  return setSessionCookie(res, newToken);
}
