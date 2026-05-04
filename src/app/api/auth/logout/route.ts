import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  return clearSessionCookie(res);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const res = NextResponse.redirect(new URL('/login', url.origin));
  return clearSessionCookie(res);
}
