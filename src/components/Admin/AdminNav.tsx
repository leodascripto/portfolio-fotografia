// src/components/Admin/AdminNav.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const AdminNav: React.FC = () => {
  const router = useRouter();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'fa-dashboard' },
    { href: '/admin/photos', label: 'Gerenciar Fotos', icon: 'fa-image' },
    { href: '/admin/categories', label: 'Categorias', icon: 'fa-folder' },
  ];

  return (
    <nav className="admin-nav">
      <div className="admin-nav-items">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} legacyBehavior>
            <motion.a
              className={`admin-nav-item ${router.pathname === item.href ? 'active' : ''}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className={`fa ${item.icon}`} />
              <span>{item.label}</span>
            </motion.a>
          </Link>
        ))}

        {/* Link para Portfolio Público - CORRIGIDO */}
        
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-nav-item portfolio-link"
        >
          <i className="fa fa-external-link" />
          <span>Ver Portfolio Público</span>
        </a>
      </div>
    </nav>
  );
};

export default AdminNav;