// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/portfolio-globals.css'; // Portfolio público (modular)
import '@/styles/admin-globals.css';     // Admin (modular)

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