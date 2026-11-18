import './globals.css';
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google';
import Shell from '@/components/Shell';

const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--f-title', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--f-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--f-mono', display: 'swap' });

export const metadata = {
  title: 'B3RL1N — Video Editor',
  description: 'B3RL1N is a video editor working in After Effects and Premiere Pro. Cinematic edits, built frame by frame.',
};
export const viewport = { themeColor: '#050505', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
