// src/pages/admin/categories/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';
import AdminNav from '@/components/Admin/AdminNav';
import { useAuth } from '@/contexts/AuthContext';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/firestore';
import type { Category } from '@/types/admin';

const CategoriesManagement: React.FC = () => {
  const { user, signOut } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: { name: string; icon: string }) => {
    try {
      await createCategory({ ...data, order: categories.length + 1 });
      await loadCategories();
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      alert('Erro ao adicionar categoria');
    }
  };

  const handleEdit = async (id: string, data: Partial<Category>) => {
    try {
      await updateCategory(id, data);
      await loadCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error('Erro ao editar:', error);
      alert('Erro ao editar categoria');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir categoria');
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Gerenciar Categorias - Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-content">
            <div className="header-left">
              <h1>📂 Gerenciar Categorias</h1>
              <p className="header-subtitle">{categories.length} categorias</p>
            </div>
            <div className="admin-user-info">
              <span>👤 {user?.email}</span>
              <motion.button onClick={signOut} className="admin-logout-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="fa fa-sign-out" />
                Sair
              </motion.button>
            </div>
          </div>
          <AdminNav />
        </header>

        <main className="admin-main">
          <div className="admin-actions-bar">
            <motion.button className="btn btn-primary" onClick={() => setShowAddModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <i className="fa fa-plus" />
              Adicionar Categoria
            </motion.button>
          </div>

          <div className="admin-card">
            <div className="admin-card-body">
              {loading ? (
                <div className="loading-state">
                  <i className="fa fa-spinner fa-spin" />
                  <p>Carregando...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="empty-state">
                  <i className="fa fa-folder-open" />
                  <h3>Nenhuma categoria encontrada</h3>
                  <p>Adicione sua primeira categoria</p>
                </div>
              ) : (
                <div className="categories-list">
                  {categories.map((cat) => (
                    <div key={cat.id} className="category-item">
                      <div className="category-icon">{cat.icon}</div>
                      <div className="category-info">
                        <h4>{cat.name}</h4>
                        <span>Ordem: {cat.order}</span>
                      </div>
                      <div className="category-actions">
                        <button className="btn-icon edit" onClick={() => setEditingCategory(cat)}><i className="fa fa-edit" /></button>
                        <button className="btn-icon delete" onClick={() => handleDelete(cat.id)}><i className="fa fa-trash" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Adicionar */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-container modal-medium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Categoria</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAdd({
                  name: formData.get('name') as string,
                  icon: formData.get('icon') as string
                });
              }}>
                <div className="form-group">
                  <label>Nome</label>
                  <input type="text" name="name" required />
                </div>
                <div className="form-group">
                  <label>Ícone (emoji)</label>
                  <input type="text" name="icon" placeholder="📷" required />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Adicionar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {editingCategory && (
        <div className="modal-backdrop" onClick={() => setEditingCategory(null)}>
          <div className="modal-container modal-medium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Categoria</h2>
              <button className="modal-close" onClick={() => setEditingCategory(null)}>
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleEdit(editingCategory.id, {
                  name: formData.get('name') as string,
                  icon: formData.get('icon') as string
                });
              }}>
                <div className="form-group">
                  <label>Nome</label>
                  <input type="text" name="name" defaultValue={editingCategory.name} required />
                </div>
                <div className="form-group">
                  <label>Ícone (emoji)</label>
                  <input type="text" name="icon" defaultValue={editingCategory.icon} required />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingCategory(null)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default CategoriesManagement;