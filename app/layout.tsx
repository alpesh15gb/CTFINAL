import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Cartunez — Built around you.',
 description: 'Custom interiors, car audio, ambient lighting, alloy wheels and ECU tuning in Secunderabad, Hyderabad. Make your car your own with Cartunez.',
 icons: { icon: '/assets/cartunez-logo.png' },
};
export const viewport: Viewport = { themeColor: '#080a0c' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}
