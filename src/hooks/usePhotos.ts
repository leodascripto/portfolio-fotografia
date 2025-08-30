import { useState, useEffect } from 'react';
import { Photo, FilterOption } from '@/types';

const fallbackPhotos: Photo[] = [
  { name: "Débora", src: "https://i.ibb.co/SxSv6cY/c73b09db7e992cf19e904c273fc0da6a.jpg", filter: "debora" },
  { name: "Gustavo", src: "https://i.ibb.co/mqzGrSc/1714166687091-2.jpg", filter: "gustavo" },
  { name: "Fernanda", src: "https://i.ibb.co/TmwLKgd/1717383827414-1.jpg", filter: "fernanda" },
  { name: "Akira", src: "https://i.ibb.co/0DNJf75/ef03e1e1a7d3041c30a4b248196a0228.jpg", filter: "akira" },
  { name: "Leo Oli", src: "https://i.ibb.co/gzsg2HL/c1f322153045747e8c0ae38e817867ef.jpg", filter: "leooli" },
  { name: "Lisa", src: "https://i.ibb.co/s2B7x0K/1715149773368-3.jpg", filter: "lisa" }
];

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/json/photos.json');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar fotos do JSON');
        }

        const data: Photo[] = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Dados inválidos no JSON');
        }

        setPhotos(data);
        generateFilters(data);
      } catch (err) {
        console.error('Erro ao carregar fotos, usando fallback:', err);
        setPhotos(fallbackPhotos);
        generateFilters(fallbackPhotos);
        setError('Usando imagens de demonstração');
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const generateFilters = (photoList: Photo[]) => {
    // Extrair filtros únicos das fotos
    const uniqueFilters = Array.from(
      new Set(photoList.map(photo => photo.filter))
    );

    // Criar array de filtros com labels amigáveis
    const filterOptions: FilterOption[] = [
      { label: 'Todos', value: '*', className: 'all' }
    ];

    uniqueFilters.forEach(filter => {
      const label = filter.charAt(0).toUpperCase() + filter.slice(1);
      filterOptions.push({
        label,
        value: filter,
        className: filter
      });
    });

    setFilters(filterOptions);
  };

  const getPhotosByFilter = (filterValue: string): Photo[] => {
    if (filterValue === '*') {
      return photos;
    }
    return photos.filter(photo => photo.filter === filterValue);
  };

  return {
    photos,
    filters,
    isLoading,
    error,
    getPhotosByFilter
  };
};