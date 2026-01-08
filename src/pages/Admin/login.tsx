// src/pages/admin/login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Leo Oli Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-login-container">
        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="admin-login-logo">
            <Image
              src="/assets/img/logo.png"
              alt="Leo Oli"
              width={200}
              height={100}
              priority
            />
            <h1>Painel Administrativo</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <motion.div
                className="admin-error"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <i className="fa fa-exclamation-circle" />
                {error}
              </motion.div>
            )}

            <div className="admin-input-group">
              <label htmlFor="email">
                <i className="fa fa-envelope" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="admin-input-group">
              <label htmlFor="password">
                <i className="fa fa-lock" />
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <motion.button
              type="submit"
              className="admin-login-button"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <motion.i
                    className="fa fa-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Entrando...
                </>
              ) : (
                <>
                  <i className="fa fa-sign-in" />
                  Entrar
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <div className="admin-security-notice">
            <i className="fa fa-shield" />
            <p>Área restrita e protegida</p>
          </div>

          {/* Back to site */}
          <motion.a
            href="/"
            className="admin-back-link"
            whileHover={{ x: -5 }}
          >
            <i className="fa fa-arrow-left" />
            Voltar ao site
          </motion.a>
        </motion.div>

        {/* Background particles */}
        <div className="admin-login-bg" />
      </div>
    </>
  );
};

export default AdminLogin;