import "dotenv/config";
import { PrismaClient, Rol, Momento } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Iniciando seed...');

  // ── MAESTRO ──────────────────────────────────
  const maestro = await prisma.user.upsert({
    where: { usuario: 'maestra.rosa' },
    update: {},
    create: {
      nombre: 'Rosa Mamani',
      usuario: 'maestra.rosa',
      pin: await bcrypt.hash('1234', 10),
      rol: Rol.MAESTRO,
      grado: 3,
      idioma: 'es',
      comunidad: 'Comunidad Primero de Mayo',
    },
  });
  console.log('✅ Maestro creado:', maestro.nombre);

  // ── PADRINO DIGITAL ──────────────────────────
  const padrino = await prisma.user.upsert({
    where: { usuario: 'padrino.pedro' },
    update: {},
    create: {
      nombre: 'Pedro Quispe',
      usuario: 'padrino.pedro',
      pin: await bcrypt.hash('5678', 10),
      rol: Rol.PADRINO,
      grado: 6,
      idioma: 'ay',
      comunidad: 'Comunidad Primero de Mayo',
    },
  });
  console.log('✅ Padrino creado:', padrino.nombre);

  // ── ESTUDIANTES ──────────────────────────────
  const estudiante1 = await prisma.user.upsert({
    where: { usuario: 'lucia.flores' },
    update: {},
    create: {
      nombre: 'Lucía Flores',
      usuario: 'lucia.flores',
      pin: await bcrypt.hash('1111', 10),
      rol: Rol.ESTUDIANTE,
      grado: 3,
      idioma: 'es',
      comunidad: 'Comunidad Primero de Mayo',
      padrinoId: padrino.id,
    },
  });

  const estudiante2 = await prisma.user.upsert({
    where: { usuario: 'mario.choque' },
    update: {},
    create: {
      nombre: 'Mario Choque',
      usuario: 'mario.choque',
      pin: await bcrypt.hash('2222', 10),
      rol: Rol.ESTUDIANTE,
      grado: 3,
      idioma: 'ay',
      comunidad: 'Comunidad Primero de Mayo',
      padrinoId: padrino.id,
    },
  });
  console.log('✅ Estudiantes creados:', estudiante1.nombre, estudiante2.nombre);

  // ── FAMILIAR ─────────────────────────────────
  await prisma.user.upsert({
    where: { usuario: 'mama.lucia' },
    update: {},
    create: {
      nombre: 'Carmen Flores (mamá de Lucía)',
      usuario: 'mama.lucia',
      pin: await bcrypt.hash('3333', 10),
      rol: Rol.FAMILIA,
      grado: 3,
      idioma: 'es',
      comunidad: 'Comunidad Primero de Mayo',
      hijoId: estudiante1.id,
    },
  });

  // ── TEMAS ─────────────────────────────────────
  const temaFracciones = await prisma.tema.upsert({
    where: { slug: 'fracciones' },
    update: {},
    create: {
      nombre: 'Fracciones',
      slug: 'fracciones',
      grado: 3,
      descripcion: 'Aprendemos fracciones desde nuestra realidad comunitaria',
      orden: 1,
    },
  });

  await prisma.tema.upsert({
    where: { slug: 'sumas-restas' },
    update: {},
    create: {
      nombre: 'Sumas y Restas',
      slug: 'sumas-restas',
      grado: 3,
      descripcion: 'Operaciones básicas con ejemplos de la vida diaria',
      orden: 2,
    },
  });
  console.log('✅ Temas creados');

  // ── CONTENIDO POR IDIOMA (Fracciones) ────────
  const contenidos = [
    {
      momento: Momento.PRACTICA,
      idioma: 'es',
      titulo: '¿Cómo compartimos en casa?',
      descripcion: 'Sube una foto o audio mostrando cómo dividen el pan, la fruta u otro alimento en tu hogar para que alcance para todos.',
      textoPreguntaForo: null,
    },
    {
      momento: Momento.PRACTICA,
      idioma: 'ay',
      titulo: 'Jupanaka ukhamaraki',
      descripcion: 'Uma foto utjasipana jilïrinakaru ukhamawa tantachawi uñstayapxam.',
      textoPreguntaForo: null,
    },
    {
      momento: Momento.PRACTICA,
      idioma: 'qu',
      titulo: 'Ima shina rakikunchik',
      descripcion: 'Ima shina t\'antata o mikunata rakinkichikta rimay o foto apay.',
      textoPreguntaForo: null,
    },
    {
      momento: Momento.TEORIA,
      idioma: 'es',
      titulo: 'Numerador y Denominador',
      descripcion: 'Aprende qué es una fracción, el numerador y el denominador con ejemplos de tu comunidad.',
      urlVideo: 'https://www.youtube.com/embed/demofracciones',
    },
    {
      momento: Momento.TEORIA,
      idioma: 'ay',
      titulo: 'Ch\'iqtañan yatxatawi',
      descripcion: 'Fractionnakan yatintañataki video uñjam.',
      urlVideo: 'https://www.youtube.com/embed/demofracciones',
    },
    {
      momento: Momento.VALORACION,
      idioma: 'es',
      titulo: 'Reflexionamos juntos',
      descripcion: 'Comparte tu opinión en el muro colaborativo.',
      textoPreguntaForo: '¿Cómo nos ayuda saber fracciones para vender productos en la feria o compartir comida en casa?',
    },
    {
      momento: Momento.VALORACION,
      idioma: 'ay',
      titulo: 'Arsuñataki',
      descripcion: 'Muruni irnaqañataki',
      textoPreguntaForo: 'Kamsatäna ch\'iqtañan yatiqawi ukhamawa feriankir churapxañataki?',
    },
    {
      momento: Momento.PRODUCCION,
      idioma: 'es',
      titulo: 'Tienda de Fracciones',
      descripcion: 'Crea tu "Puesto de Feria Virtual" donde vendas cuartos o medios kilogramos de productos locales. Puedes subir fotos, dibujos o un video de tu tienda.',
    },
    {
      momento: Momento.PRODUCCION,
      idioma: 'ay',
      titulo: 'Fraccionan qhathu',
      descripcion: 'Frayta qhathunchiru ch\'iqtanakat uñstayam.',
    },
  ];

  for (const c of contenidos) {
    await prisma.contenidoTema.create({
      data: { temaId: temaFracciones.id, ...c },
    }).catch(() => {}); // ignora duplicados en re-seed
  }
  console.log('✅ Contenido de temas creado');

  // ── PROGRESO INICIAL (Práctica desbloqueada) ──
  await prisma.progreso.upsert({
    where: { userId_temaId_momento: { userId: estudiante1.id, temaId: temaFracciones.id, momento: Momento.PRACTICA } },
    update: {},
    create: { userId: estudiante1.id, temaId: temaFracciones.id, momento: Momento.PRACTICA },
  });
  await prisma.progreso.upsert({
    where: { userId_temaId_momento: { userId: estudiante2.id, temaId: temaFracciones.id, momento: Momento.PRACTICA } },
    update: {},
    create: { userId: estudiante2.id, temaId: temaFracciones.id, momento: Momento.PRACTICA },
  });

  console.log('\n🎉 Seed completado!\n');
  console.log('Usuarios de prueba:');
  console.log('  Maestro   → usuario: maestra.rosa   | pin: 1234');
  console.log('  Padrino   → usuario: padrino.pedro  | pin: 5678');
  console.log('  Estudiante→ usuario: lucia.flores   | pin: 1111');
  console.log('  Estudiante→ usuario: mario.choque   | pin: 2222');
  console.log('  Familia   → usuario: mama.lucia     | pin: 3333');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
