// src/pages/admin/photos/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';
import AdminNav from '@/components/Admin/AdminNav';
import Card from '@/components/Admin/Common/Card';
import LoadingOverlay from '@/components/Admin/Common/LoadingOverlay';
import PhotoCard from '@/components/Admin/PhotoManager/PhotoCard';
import AddPhotoModal from '@/components/Admin/PhotoManager/AddPhotoModal';
import EditPhotoModal from '@/components/Admin/PhotoManager/EditPhotoModal';
import { useAuth } from '@/contexts/AuthContext';
import { getPhotos, getCategories, createPhoto, updatePhoto, deletePhoto, updatePhotosOrder } from '@/lib/firestore';
import type { Photo, Category } from '@/types/admin';

// Wrapper sortable para PhotoCard
const SortablePhotoCard: React.FC<{
  photo: Photo;
  onEdit: (photo: Photo) => void;
  onDelete: (id: string) => void;
}> = ({ photo, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PhotoCard
        photo={photo}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
};

const PhotosManagement: React.FC = () => {
  const { user, signOut } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Filter photos
  useEffect(() => {
    let filtered = photos;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(photo => photo.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(photo =>
        photo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPhotos(filtered);
  }, [photos, selectedCategory, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [photosData, categoriesData] = await Promise.all([
        getPhotos(),
        getCategories()
      ]);
      setPhotos(photosData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async (data: { name: string; url: string; category: string }) => {
    try {
      const now = new Date().toISOString();
      const newPhoto = {
        ...data,
        order: photos.length + 1,
        createdAt: now,
        updatedAt: now
      };
      
      await createPhoto(newPhoto);
      await loadData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      throw error;
    }
  };

  const handleEditPhoto = async (id: string, updates: Partial<Photo>) => {
    try {
      await updatePhoto(id, updates);
      await loadData();
      setShowEditModal(false);
      setEditingPhoto(null);
    } catch (error) {
      console.error('Erro ao editar foto:', error);
      throw error;
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await deletePhoto(id);
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      alert('Erro ao excluir foto');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredPhotos.findIndex(photo => photo.id === active.id);
      const newIndex = filteredPhotos.findIndex(photo => photo.id === over.id);

      const newOrder = arrayMove(filteredPhotos, oldIndex, newIndex);
      setFilteredPhotos(newOrder);

      const updates = newOrder.map((photo, index) => ({
        id: photo.id,
        order: index + 1
      }));

      try {
        await updatePhotosOrder(updates);
        await loadData();
      } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
        alert('Erro ao salvar nova ordem');
        await loadData();
      }
    }
  };

  const openEditModal = (photo: Photo) => {
    setEditingPhoto(photo);
    setShowEditModal(true);
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Gerenciar Fotos - Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-dashboard">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-content">
            <div className="header-left">
              <h1>📸 Gerenciar Fotos</h1>
              <p className="header-subtitle">
                {photos.length} foto{photos.length !== 1 ? 's' : ''} • {categories.length} categoria{categories.length !== 1 ? 's' : ''}
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

        <main className="admin-main-with-preview">
          <div className="admin-main-content">
            {/* Actions Bar */}
            <div className="admin-actions-bar">
              <div className="actions-left">
                <motion.button
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fa fa-plus" />
                  Adicionar Foto
                </motion.button>

                <motion.button
                  className="btn btn-secondary"
                  onClick={() => setShowPreview(!showPreview)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={`fa ${showPreview ? 'fa-eye-slash' : 'fa-eye'}`} />
                  {showPreview ? 'Ocultar' : 'Preview'}
                </motion.button>

                <div className="search-box">
                  <i className="fa fa-search" />
                  <input
                    type="text"
                    placeholder="Buscar fotos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="clear-search"
                      onClick={() => setSearchTerm('')}
                    >
                      <i className="fa fa-times" />
                    </button>
                  )}
                </div>
              </div>

              <div className="actions-right">
                <select
                  className="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">📂 Todas as Categorias</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-portfolio"
                >
                  <i className="fa fa-external-link" />
                  Ver Portfolio
                </a>
              </div>
            </div>

            {/* Photos Grid */}
            <Card>
              {loading ? (
                <div className="loading-state">
                  <i className="fa fa-spinner fa-spin" />
                  <p>Carregando fotos...</p>
                </div>
              ) : filteredPhotos.length === 0 ? (
                <div className="empty-state">
                  <i className="fa fa-image" />
                  <h3>Nenhuma foto encontrada</h3>
                  <p>
                    {searchTerm
                      ? 'Tente uma busca diferente'
                      : 'Adicione sua primeira foto clicando no botão "Adicionar Foto" acima'}
                  </p>
                  {photos.length === 0 && (
                    <motion.button
                      className="btn btn-primary"
                      onClick={() => setShowAddModal(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ marginTop: '20px' }}
                    >
                      <i className="fa fa-plus" />
                      Adicionar Primeira Foto
                    </motion.button>
                  )}
                </div>
              ) : (
                <>
                  <div className="photos-grid-header">
                    <p>
                      Mostrando {filteredPhotos.length} de {photos.length} fotos
                    </p>
                    <p className="drag-hint">
                      <i className="fa fa-hand-pointer-o" />
                      Arraste as fotos para reordenar
                    </p>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={filteredPhotos.map(p => p.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="photos-grid">
                        <AnimatePresence>
                          {filteredPhotos.map((photo) => (
                            <SortablePhotoCard
                              key={photo.id}
                              photo={photo}
                              onEdit={openEditModal}
                              onDelete={handleDeletePhoto}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              )}
            </Card>
          </div>

          {/* Preview Sidebar */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                className="admin-preview-sidebar"
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="preview-header">
                  <h3>
                    <i className="fa fa-eye" />
                    Preview do Portfolio
                  </h3>
                  <button onClick={() => setShowPreview(false)}>
                    <i className="fa fa-times" />
                  </button>
                </div>
                <div className="preview-content">
                  <iframe
                    src="/"
                    title="Portfolio Preview"
                    className="preview-iframe"
                  />
                </div>
                <div className="preview-footer">
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-external-link" />
                    Abrir em nova aba
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <AddPhotoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onAdd={handleAddPhoto}
      />

      <EditPhotoModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPhoto(null);
        }}
        photo={editingPhoto}
        categories={categories}
        onSave={handleEditPhoto}
      />

      <LoadingOverlay isLoading={loading} message="Carregando..." />
    </ProtectedRoute>
  );
};

export default PhotosManagement;