import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import { prisma } from '@/lib/db';

export default async function RootPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  if (session.rol === 'MAESTRO') redirect('/maestro');
  if (session.rol === 'PADRINO') redirect('/tutoria');
  
  if (session.rol === 'FAMILIA') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { hijo: { select: { id: true } } }
    });
    if (user?.hijo) {
      // Redirigir al mapa pero con un flag o a una vista de "Progreso del Hijo"
      // Por ahora, redirigimos al mapa y en el futuro podemos hacer una vista específica
      redirect(`/mapa?viewAs=familia&estudianteId=${user.hijo.id}`);
    }
  }

  redirect('/mapa');
}
