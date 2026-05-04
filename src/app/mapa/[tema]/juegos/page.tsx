import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import JuegoInteractivo from './JuegoInteractivo';

export default async function JuegosPage({
  params,
}: {
  params: Promise<{ tema: string }>;
}) {
  const { tema: temaSlug } = await params;
  const session = await getSession();
  if (!session) redirect('/login');

  const tema = await prisma.tema.findUnique({ where: { slug: temaSlug } });
  if (!tema) redirect('/mapa');

  // We don't enforce progression blocking for games; they are optional fun activities

  return (
    <div className="contenedor">
      <JuegoInteractivo temaSlug={temaSlug} />
    </div>
  );
}
