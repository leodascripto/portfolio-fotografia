// src/components/Admin/PhotoManager/AddPhotoModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/Admin/Common/Modal';
import UploadZone from './UploadZone';
import type { Category } from '@/types/admin';

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (data: { name: string; url: string; category: string }) => Promise<void>;
}

const AddPhotoModal: React.FC<AddPhotoModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      setError('Por favor, faça upload de uma imagem');
      return;
    }

    if (!name.trim()) {
      setError('Digite um nome para a foto');
      return;
    }

    if (!category) {
      setError('Selecione uma categoria');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await onAdd({ 
        name: name.trim(), 
        url: imageUrl, 
        category 
      });
      
      // Reset form
      handleReset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar foto');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    setUploading(false);
  };

  const handleReset = () => {
    setName('');
    setCategory('');
    setImageUrl('');
    setError('');
  };

  const handleClose = () => {
    if (!saving && !uploading) {
      handleReset();
      onClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="📸 Adicionar Nova Foto" 
      size="large"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-error">
            <i className="fa fa-exclamation-circle" />
            {error}
          </div>
        )}

        {/* Seção 1: Upload */}
        <div className="form-section">
          <h4>1️⃣ Upload da Imagem</h4>
          {imageUrl ? (
            <div className="image-preview-container">
              <img src={imageUrl} alt="Preview" className="image-preview" />
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => setImageUrl('')}
                disabled={saving}
              >
                <i className="fa fa-times" />
                Remover imagem
              </button>
            </div>
          ) : (
            <UploadZone
              onUploadComplete={handleUploadComplete}
              onUploadStart={() => setUploading(true)}
            />
          )}
        </div>

        {/* Seção 2: Informações (só aparece após upload) */}
        {imageUrl && (
          <div className="form-section">
            <h4>2️⃣ Informações da Foto</h4>
            
            <div className="form-group">
              <label htmlFor="photo-name">
                <i className="fa fa-tag" />
                Nome da Foto *
              </label>
              <input
                id="photo-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Retrato Fernanda, Ensaio Lisa..."
                required
                disabled={saving}
                maxLength={100}
              />
              <small>{name.length}/100 caracteres</small>
            </div>

            <div className="form-group">
              <label htmlFor="photo-category">
                <i className="fa fa-folder" />
                Categoria *
              </label>
              <select
                id="photo-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={saving}
              >
                <option value="">Selecione uma categoria</option>
                {categories
                  .sort((a, b) => a.order - b.order)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Preview final */}
            <div className="photo-preview-card">
              <div className="preview-label">Preview:</div>
              <div className="preview-content">
                <img src={imageUrl} alt={name || 'Preview'} />
                <div className="preview-info">
                  <strong>{name || 'Nome da foto'}</strong>
                  <span>
                    {category 
                      ? `${categories.find(c => c.id === category)?.icon} ${categories.find(c => c.id === category)?.name}`
                      : 'Nenhuma categoria selecionada'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer com botões */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={imageUrl ? handleReset : handleClose}
            disabled={saving || uploading}
          >
            {imageUrl ? (
              <>
                <i className="fa fa-refresh" />
                Resetar
              </>
            ) : (
              'Cancelar'
            )}
          </button>
          
          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={!imageUrl || saving || uploading || !name.trim() || !category}
            whileHover={{ scale: saving || uploading ? 1 : 1.02 }}
            whileTap={{ scale: saving || uploading ? 1 : 0.98 }}
          >
            {saving ? (
              <>
                <i className="fa fa-spinner fa-spin" />
                Salvando...
              </>
            ) : (
              <>
                <i className="fa fa-plus" />
                Adicionar Foto
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPhotoModal;