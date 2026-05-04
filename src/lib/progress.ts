import { prisma } from './db';
import { Momento } from '@prisma/client';

const MOMENT_ORDER: Momento[] = ['PRACTICA', 'TEORIA', 'VALORACION', 'PRODUCCION'];

// ── Devuelve el estado de todos los momentos para un usuario/tema ────
export async function getProgresoCompleto(userId: string, temaId: string) {
  const progresos = await prisma.progreso.findMany({
    where: { userId, temaId },
  });
  const map = Object.fromEntries(progresos.map((p) => [p.momento, p]));
  return MOMENT_ORDER.map((m) => ({
    momento: m,
    completado: map[m]?.completado ?? false,
    disponible: isMomentoDisponible(m, map),
  }));
}

// Un momento está disponible si el anterior está completado
function isMomentoDisponible(
  momento: Momento,
  map: Record<string, { completado: boolean }>
): boolean {
  const idx = MOMENT_ORDER.indexOf(momento);
  if (idx === 0) return true; // PRACTICA siempre disponible
  const prev = MOMENT_ORDER[idx - 1];
  return map[prev]?.completado === true;
}

// ── Marca un momento como completado y desbloquea el siguiente ───────
export async function completarMomento(
  userId: string,
  temaId: string,
  momento: Momento
): Promise<void> {
  // Verificar que el anterior está completado (excepto PRACTICA)
  const idx = MOMENT_ORDER.indexOf(momento);
  if (idx > 0) {
    const prev = MOMENT_ORDER[idx - 1];
    const prevProgreso = await prisma.progreso.findUnique({
      where: { userId_temaId_momento: { userId, temaId, momento: prev } },
    });
    if (!prevProgreso?.completado) {
      throw new Error(`Debes completar ${prev} primero`);
    }
  }

  // Marcar como completado
  await prisma.progreso.upsert({
    where: { userId_temaId_momento: { userId, temaId, momento } },
    update: { completado: true, completadoAt: new Date() },
    create: { userId, temaId, momento, completado: true, completadoAt: new Date() },
  });

  // Crear progreso del siguiente momento si existe
  const next = MOMENT_ORDER[idx + 1];
  if (next) {
    await prisma.progreso.upsert({
      where: { userId_temaId_momento: { userId, temaId, momento: next } },
      update: {},
      create: { userId, temaId, momento: next, completado: false },
    });
  }

  // Si el padrino existe, crear alerta de logro
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { padrinoId: true, nombre: true },
  });
  if (user?.padrinoId) {
    await prisma.alertaPadrino.create({
      data: {
        ahijadoId: userId,
        padrinoId: user.padrinoId,
        tipo: 'logro',
        mensaje: `${user.nombre} completó el momento ${momento} en el tema actual`,
      },
    });
  }
}

// ── Crea alerta de inactividad (llamar desde un cron o trigger) ───────
export async function crearAlertaInactividad(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { padrinoId: true, nombre: true },
  });
  if (!user?.padrinoId) return;

  await prisma.alertaPadrino.create({
    data: {
      ahijadoId: userId,
      padrinoId: user.padrinoId,
      tipo: 'inactividad',
      mensaje: `${user.nombre} no ha interactuado en las últimas 48 horas`,
    },
  });
}
