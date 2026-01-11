// src/components/Admin/CategoryManager/CategoryCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Category } from '@/types/admin';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  photoCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onEdit, 
  onDelete,
  photoCount 
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (photoCount > 0) {
      alert(`Não é possível excluir a categoria "${category.name}" porque ela possui ${photoCount} foto(s). Remova as fotos primeiro.`);
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) return;
    
    setDeleting(true);
    try {
      await onDelete(category.id);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setDeleting(false);
      alert('Erro ao excluir categoria');
    }
  };

  const handleEdit = () => {
    console.log('Editando categoria:', category); // ✅ Debug
    onEdit(category);
  };

  return (
    <motion.div
      className={`category-card ${deleting ? 'deleting' : ''}`}
      whileHover={{ y: -4 }}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="category-icon">
        {category.icon}
      </div>

      <div className="category-info">
        {/* ✅ SEMPRE USA category.name */}
        <h3>{category.name}</h3>
        <p className="category-count">
          {photoCount} foto{photoCount !== 1 ? 's' : ''}
        </p>
      </div>

      {!deleting && (
        <div className="category-actions">
          <motion.button
            className="btn-icon btn-edit"
            onClick={handleEdit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Editar categoria"
          >
            <i className="fa fa-edit" />
          </motion.button>
          
          <motion.button
            className="btn-icon btn-delete"
            onClick={handleDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Excluir categoria"
          >
            <i className="fa fa-trash" />
          </motion.button>
        </div>
      )}

      {deleting && (
        <div className="category-deleting">
          <i className="fa fa-spinner fa-spin" />
        </div>
      )}
    </motion.div>
  );
};

export default CategoryCard;