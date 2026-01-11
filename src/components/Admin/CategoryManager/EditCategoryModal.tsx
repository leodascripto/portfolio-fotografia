// src/components/Admin/CategoryManager/EditCategoryModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '@/types/admin';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (id: string, updates: { name: string; icon: string }) => Promise<void>;
}

const EMOJI_SUGGESTIONS = [
  '👤', '👨', '👩', '🧑', '👶', '👧', '👦',
  '💼', '🎨', '📸', '🎬', '🎭', '🎪', '🎯',
  '⭐', '✨', '💫', '🌟', '🔥', '💎', '👑',
  '🌸', '🌺', '🌻', '🌹', '🌷', '🍀', '🌿',
  '❤️', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '🎵', '🎶', '🎸', '🎹', '🎤', '🎧', '🎼',
  '🏆', '🎖️', '🏅', '🥇', '🥈', '🥉', '🎗️',
  '🍜', '🍱', '🍣', '🍛', '🍝', '🍕', '🍔',
  '☕', '🍵', '🧋', '🍹', '🍸', '🍷', '🍺'
];

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ✅ Carrega dados da categoria quando modal abre
  useEffect(() => {
    if (category && isOpen) {
      console.log('Carregando categoria no modal:', category); // Debug
      
      // ✅ SEMPRE usa category.name
      setName(category.name || '');
      setIcon(category.icon || '📁');
      setError('');
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Digite um nome para a categoria');
      return;
    }

    if (!category) {
      setError('Categoria não encontrada');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // ✅ Salva com name correto
      await onSave(category.id, {
        name: name.trim(),
        icon: icon || '📁'
      });
      
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', err);
      setError(err.message || 'Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setName('');
      setIcon('');
      setError('');
      onClose();
    }
  };

  if (!category) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>✏️ Editar Categoria</h2>
              <button
                className="modal-close"
                onClick={handleClose}
                disabled={saving}
              >
                <i className="fa fa-times" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-error">
                    <i className="fa fa-exclamation-circle" />
                    {error}
                  </div>
                )}

                {/* Nome */}
                <div className="form-group">
                  <label>Nome da Categoria</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Retratos, Paisagens..."
                    disabled={saving}
                    autoFocus
                    maxLength={50}
                  />
                  <small>{name.length}/50 caracteres</small>
                </div>

                {/* Ícone Atual */}
                <div className="form-group">
                  <label>Ícone</label>
                  <div className="icon-picker-current">
                    <div className="current-icon">{icon || '📁'}</div>
                    <input
                      type="text"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="Cole um emoji aqui"
                      disabled={saving}
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Sugestões de Emojis */}
                <div className="form-group">
                  <label>Sugestões de Emojis</label>
                  <div className="emoji-grid">
                    {EMOJI_SUGGESTIONS.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`emoji-option ${icon === emoji ? 'selected' : ''}`}
                        onClick={() => setIcon(emoji)}
                        disabled={saving}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="category-preview">
                  <div className="preview-label">Preview:</div>
                  <div className="preview-card">
                    <span className="preview-icon">{icon || '📁'}</span>
                    <span className="preview-name">{name || 'Nome da categoria'}</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || !name.trim()}
                >
                  {saving ? (
                    <>
                      <i className="fa fa-spinner fa-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-save" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditCategoryModal;