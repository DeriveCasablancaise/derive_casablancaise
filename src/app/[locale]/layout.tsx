import { Inter } from 'next/font/google';
import './globals.css';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from 'react-hot-toast';
import { Providers } from '../../components/shared/providers';
import Header from '../../components/shared/header';
import DesktopHeader from '@/components/shared/DesktopHeader';
import { constructMetadata } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata = constructMetadata();
export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.className} ${
          locale === 'ar' ? '__rtl_lang text-right' : ''
        } bg-[#E9EAEB] text-gray-950 relative`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <DesktopHeader />
            <Header />
            {children}
            <Toaster position="top-right" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
