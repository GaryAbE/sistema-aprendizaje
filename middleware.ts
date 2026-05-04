import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

// Rutas públicas que no requieren auth
const PUBLIC_ROUTES = ['/login', '/api/auth/login'];
// Rutas que requieren idioma configurado
const IDIOMA_REQUIRED = ['/mapa', '/tutoria'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir archivos estáticos y rutas API de auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/uploads') ||
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(request);

  // Sin sesión → redirigir al login
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Si está en / → redirigir según rol
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    if (session.rol === 'MAESTRO') {
      url.pathname = '/maestro';
    } else if (session.rol === 'PADRINO') {
      url.pathname = '/tutoria';
    } else {
      url.pathname = '/mapa';
    }
    return NextResponse.redirect(url);
  }

  // Estudiante sin idioma configurado → selector de idioma
  if (
    session.idioma === 'sin_configurar' &&
    IDIOMA_REQUIRED.some((r) => pathname.startsWith(r))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/idioma';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
