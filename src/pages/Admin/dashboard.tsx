// src/pages/admin/dashboard.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';
import AdminNav from '@/components/Admin/AdminNav';
import { useAuth } from '@/contexts/AuthContext';
import { getPhotos, getCategories } from '@/lib/firestore';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalCategories: 0,
    loading: true
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [photos, categories] = await Promise.all([
        getPhotos(),
        getCategories()
      ]);
      
      setStats({
        totalPhotos: photos.length,
        totalCategories: categories.length,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const quickActions = [
    {
      title: '📸 Gerenciar Fotos',
      description: 'Adicionar, editar e organizar fotos do portfolio',
      href: '/admin/photos',
      color: 'primary',
      icon: 'fa-image'
    },
    {
      title: '📂 Categorias',
      description: 'Gerenciar categorias de fotos',
      href: '/admin/categories',
      color: 'secondary',
      icon: 'fa-folder'
    },
    {
      title: '🌐 Ver Portfolio',
      description: 'Visualizar o site público',
      href: '/',
      color: 'success',
      icon: 'fa-external-link',
      external: true
    }
  ];

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-content">
            <div className="header-left">
              <h1>📊 Dashboard</h1>
              <p className="header-subtitle">
                Bem-vindo ao painel administrativo
              </p>
            </div>
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

          {/* Navegação */}
          <AdminNav />
        </header>

        <main className="admin-main">
          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <motion.div
              className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <i className="fa fa-image" />
              <h3>Total de Fotos</h3>
              <p className="stat-number">
                {stats.loading ? '...' : stats.totalPhotos}
              </p>
              <Link href="/admin/photos" className="stat-link">
                Ver todas →
              </Link>
            </motion.div>

            <motion.div
              className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <i className="fa fa-folder" />
              <h3>Categorias</h3>
              <p className="stat-number">
                {stats.loading ? '...' : stats.totalCategories}
              </p>
              <Link href="/admin/categories" className="stat-link">
                Gerenciar →
              </Link>
            </motion.div>

            <motion.div
              className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <i className="fa fa-eye" />
              <h3>Portfolio Público</h3>
              <p className="stat-number">
                <i className="fa fa-check-circle" style={{ color: '#4caf50', fontSize: '32px' }} />
              </p>
              <a href="/" target="_blank" rel="noopener noreferrer" className="stat-link">
                Visualizar →
              </a>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fa fa-bolt" />
              Ações Rápidas
            </h2>
            
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {action.external ? (
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`quick-action-card ${action.color}`}
                    >
                      <div className="action-icon">
                        <i className={`fa ${action.icon}`} />
                      </div>
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                      <div className="action-arrow">
                        <i className="fa fa-arrow-right" />
                      </div>
                    </a>
                  ) : (
                    <Link href={action.href} className={`quick-action-card ${action.color}`}>
                      <div className="action-icon">
                        <i className={`fa ${action.icon}`} />
                      </div>
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                      <div className="action-arrow">
                        <i className="fa fa-arrow-right" />
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fa fa-clock-o" />
              Atividade Recente
            </h2>
            
            <div className="activity-card">
              <div className="activity-empty">
                <i className="fa fa-info-circle" />
                <p>Sistema de atividades será implementado em breve</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;