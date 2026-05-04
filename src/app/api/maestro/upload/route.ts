import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/uploads';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.rol !== 'MAESTRO') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const archivo = formData.get('archivo') as File | null;
    const temaSlug = formData.get('temaSlug') as string || 'general';

    if (!archivo || archivo.size === 0) {
      return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });
    }

    const saved = await saveUploadedFile(archivo, session.userId, temaSlug);
    if (!saved) {
      return NextResponse.json({ error: 'Error guardando archivo' }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: saved.url, tipo: saved.tipo, nombre: saved.nombreArchivo });
  } catch (error) {
    console.error('Maestro upload error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
