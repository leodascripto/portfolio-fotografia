// src/components/Admin/PhotoManager/PhotoCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Photo } from '@/types/admin';

interface PhotoCardProps {
  photo: Photo;
  onEdit: (photo: Photo) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any; // Props do drag handle (listeners)
}

const PhotoCard: React.FC<PhotoCardProps> = ({ 
  photo, 
  onEdit, 
  onDelete, 
  isDragging,
  dragHandleProps 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ Impede drag-and-drop
    
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return;
    
    setDeleting(true);
    try {
      await onDelete(photo.id);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ Impede drag-and-drop
    onEdit(photo);
  };

  return (
    <motion.div
      className={`photo-card ${isDragging ? 'dragging' : ''} ${deleting ? 'deleting' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -5 }}
    >
      <div className="photo-card-image">
        <Image
          src={photo.url}
          alt={photo.name}
          width={300}
          height={300}
          style={{ objectFit: 'cover' }}
        />
        
        {/* ✅ Drag Handle - SEPARADO dos botões */}
        <div 
          className="photo-card-drag-handle"
          {...dragHandleProps} // Apenas o handle tem listeners
        >
          <i className="fa fa-arrows" />
        </div>

        {showActions && !deleting && (
          <motion.div
            className="photo-card-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              className="action-btn edit"
              onClick={handleEdit} // ✅ stopPropagation dentro
              title="Editar"
            >
              <i className="fa fa-edit" />
            </button>
            <button
              className="action-btn delete"
              onClick={handleDelete} // ✅ stopPropagation dentro
              title="Excluir"
            >
              <i className="fa fa-trash" />
            </button>
          </motion.div>
        )}

        {deleting && (
          <div className="photo-card-deleting">
            <i className="fa fa-spinner fa-spin" />
          </div>
        )}
      </div>

      <div className="photo-card-info">
        <h4>{photo.name}</h4>
        <div className="photo-card-meta">
          <span className="category">
            <i className="fa fa-folder" />
            {photo.category}
          </span>
          <span className="order">
            <i className="fa fa-sort-numeric-asc" />
            {photo.order}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCard;