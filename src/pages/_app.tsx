// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';
import '@/styles/admin.css'; // Novo arquivo CSS para admin

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default MyApp;