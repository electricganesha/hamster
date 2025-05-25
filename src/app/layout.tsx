import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksandSans = Quicksand({
  variable: '--font-quicksand-sans',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mooey Maria Hazel Monitoring Dashboard',
  description: "A dashboard for monitoring Mooey Maria Hazel's activity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksandSans.variable} ${quicksandSans.variable}`}>{children}</body>
    </html>
  );
}
