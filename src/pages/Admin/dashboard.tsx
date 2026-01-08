// src/pages/admin/dashboard.tsx
import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/pages/Admin/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1>Dashboard</h1>
            <div className="admin-user-info">
              <span>👤 {user?.email}</span>
              <motion.button
                onClick={signOut}
                className="admin-logout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fa fa-sign-out" />
                Sair
              </motion.button>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <div className="admin-welcome">
            <h2>🎉 Bem-vindo ao Painel Admin!</h2>
            <p>Sistema de gerenciamento de fotos em desenvolvimento...</p>
          </div>

          <div className="admin-stats-grid">
            <motion.div
              className="admin-stat-card"
              whileHover={{ y: -5 }}
            >
              <i className="fa fa-image" />
              <h3>Total de Fotos</h3>
              <p className="stat-number">0</p>
            </motion.div>

            <motion.div
              className="admin-stat-card"
              whileHover={{ y: -5 }}
            >
              <i className="fa fa-folder" />
              <h3>Categorias</h3>
              <p className="stat-number">7</p>
            </motion.div>

            <motion.div
              className="admin-stat-card"
              whileHover={{ y: -5 }}
            >
              <i className="fa fa-eye" />
              <h3>Visualizações</h3>
              <p className="stat-number">-</p>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;