import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { t, type Idioma } from '@/lib/i18n';
import PracticaClient from './PracticaClient';

export default async function PracticaPage({ params }: { params: Promise<{ tema: string }> }) {
  const { tema: temaSlug } = await params;
  const session = await getSession();
  const idioma = (session?.idioma as Idioma) || 'es';

  const tema = await prisma.tema.findUnique({
    where: { slug: temaSlug }
  });

  let contenido = null;
  if (tema) {
    contenido = await prisma.contenidoTema.findFirst({
      where: { temaId: tema.id, momento: 'PRACTICA', idioma },
      include: { recursos: true }
    }) || await prisma.contenidoTema.findFirst({
      where: { temaId: tema.id, momento: 'PRACTICA', idioma: 'es' },
      include: { recursos: true }
    });
  }

  return (
    <PracticaClient 
      temaSlug={temaSlug} 
      idioma={idioma}
      contenido={contenido} 
      labels={{
        momento: t(idioma, 'momento_practica'),
        instruccion: t(idioma, 'practica_instruccion'),
        recursos: t(idioma, 'estudiante_recursos_apoyo'),
        turnoCrear: t(idioma, 'estudiante_turno_crear'),
        subirFoto: t(idioma, 'estudiante_subir_foto'),
        subirAudio: t(idioma, 'estudiante_subir_audio'),
        placeholder: t(idioma, 'estudiante_escribe_aqui'),
        completar: t(idioma, 'practica_completar'),
        guardando: t(idioma, 'cargando'),
      }}
    />
  );
}
