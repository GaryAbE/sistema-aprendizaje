import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getProgresoCompleto } from '@/lib/progress';
import { t, type Idioma } from '@/lib/i18n';
import ValoracionClient from './ValoracionClient';

export default async function ValoracionPage({
  params,
}: {
  params: Promise<{ tema: string }>;
}) {
  const { tema: temaSlug } = await params;
  const session = await getSession();
  if (!session) redirect('/login');

  const idioma = session.idioma as Idioma;
  const tema = await prisma.tema.findUnique({ where: { slug: temaSlug } });
  if (!tema) redirect('/mapa');

  const progreso = await getProgresoCompleto(session.userId, tema.id);
  const teoria = progreso.find((p) => p.momento === 'TEORIA');
  if (!teoria?.completado) redirect(`/mapa?tema=${temaSlug}`);

  // Pregunta del foro en el idioma del estudiante
  const contenido = await prisma.contenidoTema.findFirst({
    where: { temaId: tema.id, momento: 'VALORACION', idioma },
  }) ?? await prisma.contenidoTema.findFirst({
    where: { temaId: tema.id, momento: 'VALORACION', idioma: 'es' },
  });

  // Comentarios existentes
  const comentarios = await prisma.foroComentario.findMany({
    where: { temaId: tema.id },
    include: { user: { select: { nombre: true, rol: true } } },
    orderBy: { createdAt: 'asc' },
  });

  const valoracionCompletada = progreso.find((p) => p.momento === 'VALORACION')?.completado ?? false;

  return (
    <ValoracionClient
      temaSlug={temaSlug}
      idioma={idioma}
      pregunta={contenido?.textoPreguntaForo ?? '¿Cómo nos ayuda esto en nuestra comunidad?'}
      comentariosIniciales={comentarios.map((c) => ({
        id: c.id,
        contenido: c.contenido,
        tipo: c.tipo,
        createdAt: c.createdAt.toISOString(),
        user: { nombre: c.user.nombre, rol: c.user.rol },
      }))}
      userId={session.userId}
      yaCompletada={valoracionCompletada}
      labels={{
        momento: t(idioma, 'momento_valoracion'),
        placeholder: t(idioma, 'valoracion_placeholder'),
        comentarios: t(idioma, 'valoracion_comentarios'),
        completar: t(idioma, 'valoracion_completar'),
      }}
    />
  );
}
