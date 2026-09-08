import type { Metadata, Viewport } from 'next';
import { Barlow, Space_Mono, Syncopate } from 'next/font/google';
import './globals.css';

const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const syncopate = Syncopate({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
 title: 'Cartunez — Built around you.',
 description: 'Custom interiors, car audio, ambient lighting, alloy wheels and ECU tuning in Secunderabad, Hyderabad. Make your car your own with Cartunez.',
 icons: { icon: '/assets/cartunez-logo.png' },
};
export const viewport: Viewport = { themeColor: '#080a0c' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en" className={`${barlow.variable} ${syncopate.variable} ${spaceMono.variable}`}><body>{children}</body></html>;
}
