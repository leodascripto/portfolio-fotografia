// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { LanguageProvider } from '@/contexts/LanguageContext';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default MyApp;