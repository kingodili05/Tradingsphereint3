import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { LayoutContent } from '../components/layout/layout-content';
import { ReactQueryProvider } from '@/lib/react-query';

export const metadata: Metadata = {
  title: 'TradingSphereIntl.online - Global Investment Platform',
  description:
    'Professional trading platform for Crypto, Forex, ETFs, Stocks, and Commodities',
  icons: {
    icon: [
      { url: '/myfaviimg.png', sizes: '32x32', type: 'image/png' },
      { url: '/myfaviimg.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/myfaviimg.png',
    apple: '/myfaviimg.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutContent>{children}</LayoutContent>
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
