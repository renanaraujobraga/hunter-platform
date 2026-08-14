import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hunter Platform — Flight Hunter',
  description: 'Monitoramento inteligente de oportunidades de viagem.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
