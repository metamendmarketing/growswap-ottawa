import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppStoreProvider } from '@/lib/data/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GrowSwap Ottawa — Hyperlocal Food Intelligence & Barter Network',
  description:
    'Discover what is growing, swap excess harvest, forecast garden yields, and connect with 500+ Ottawa growers across the National Capital Region.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased bg-stone-50 text-stone-900`}>
        <AppStoreProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AppStoreProvider>
      </body>
    </html>
  );
}
