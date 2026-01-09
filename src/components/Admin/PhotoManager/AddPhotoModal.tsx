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

    setError('');
    setSaving(true);

    try {
      await onAdd({ name, url: imageUrl, category });
      
      // Reset form
      setName('');
      setCategory('');
      setImageUrl('');
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Foto" size="large">
      <form onSubmit={handleSubmit} className="add-photo-form">
        {error && (
          <div className="form-error">
            <i className="fa fa-exclamation-circle" />
            {error}
          </div>
        )}

        <div className="form-section">
          <h4>1. Upload da Imagem</h4>
          {imageUrl ? (
            <div className="image-preview">
              <img src={imageUrl} alt="Preview" />
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => setImageUrl('')}
                disabled={saving}
              >
                <i className="fa fa-times" />
                Remover
              </button>
            </div>
          ) : (
            <UploadZone
              onUploadComplete={handleUploadComplete}
              onUploadStart={() => setUploading(true)}
            />
          )}
        </div>

        {imageUrl && (
          <div className="form-section">
            <h4>2. Informações da Foto</h4>
            
            <div className="form-group">
              <label htmlFor="add-photo-name">
                <i className="fa fa-tag" />
                Nome da Foto
              </label>
              <input
                id="add-photo-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Retrato Débora"
                required
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="add-photo-category">
                <i className="fa fa-folder" />
                Categoria
              </label>
              <select
                id="add-photo-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={saving}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={imageUrl ? handleReset : onClose}
            disabled={saving || uploading}
          >
            {imageUrl ? 'Resetar' : 'Cancelar'}
          </button>
          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={!imageUrl || saving || uploading}
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