import type { Metadata } from 'next';
import './globals.css';
import { IdiomaProvider } from '@/context/IdiomaContext';

export const metadata: Metadata = {
  title: 'AVA / EVA Comunitario',
  description: 'Sistema de aprendizaje sociocomunitario para nivel primario',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <IdiomaProvider>
          {children}
        </IdiomaProvider>
      </body>
    </html>
  );
}
