// src/components/Admin/PhotoManager/EditPhotoModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/Admin/Common/Modal';
import type { Photo, Category } from '@/types/admin';

interface EditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
  categories: Category[];
  onSave: (id: string, updates: Partial<Photo>) => Promise<void>;
}

const EditPhotoModal: React.FC<EditPhotoModalProps> = ({
  isOpen,
  onClose,
  photo,
  categories,
  onSave
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (photo) {
      setName(photo.name);
      setCategory(photo.category);
    }
  }, [photo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;

    setError('');
    setSaving(true);

    try {
      await onSave(photo.id, { name, category });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title=\"Editar Foto\" size=\"medium\">
      <form onSubmit={handleSubmit} className=\"edit-photo-form\">
        {error && (
          <div className=\"form-error\">
            <i className=\"fa fa-exclamation-circle\" />
            {error}
          </div>
        )}

        <div className=\"form-group\">
          <label htmlFor=\"photo-name\">
            <i className=\"fa fa-tag\" />
            Nome da Foto
          </label>
          <input
            id=\"photo-name\"
            type=\"text\"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=\"Ex: Retrato Débora\"
            required
            disabled={saving}
          />
        </div>

        <div className=\"form-group\">
          <label htmlFor=\"photo-category\">
            <i className=\"fa fa-folder\" />
            Categoria
          </label>
          <select
            id=\"photo-category\"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={saving}
          >
            <option value=\"\">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className=\"form-actions\">
          <button
            type=\"button\"
            className=\"btn btn-secondary\"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <motion.button
            type=\"submit\"
            className=\"btn btn-primary\"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
          >
            {saving ? (
              <>
                <i className=\"fa fa-spinner fa-spin\" />
                Salvando...
              </>
            ) : (
              <>
                <i className=\"fa fa-save\" />
                Salvar
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPhotoModal;
