import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? 'uploads';
const MAX_SIZE_MB = 10;
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/webm': 'webm',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

export async function saveUploadedFile(
  file: File,
  userId: string,
  subfolder?: string
): Promise<{ url: string; nombreArchivo: string; tipo: string } | null> {
  const mimeType = file.type;
  const ext = ALLOWED_TYPES[mimeType];
  if (!ext) return null;

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_SIZE_MB) return null;

  const filename = `${randomUUID()}.${ext}`;
  const folder = subfolder ? path.join(UPLOAD_DIR, userId, subfolder) : path.join(UPLOAD_DIR, userId);
  const absoluteDir = path.join(process.cwd(), 'public', folder);

  await fs.mkdir(absoluteDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await fs.writeFile(path.join(absoluteDir, filename), Buffer.from(bytes));

  const tipo = mimeType.startsWith('image') ? 'foto'
    : mimeType.startsWith('audio') ? 'audio'
    : 'video';

  return {
    url: `/${folder}/${filename}`,
    nombreArchivo: file.name,
    tipo,
  };
}
