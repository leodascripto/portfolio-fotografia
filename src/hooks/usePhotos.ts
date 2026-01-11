// src/hooks/usePhotos.ts
import { useState, useEffect } from 'react';
import { Photo, FilterOption } from '@/types';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

        // 🔥 PRIORIDADE 1: Tentar buscar do Firestore
        try {
          console.log('📡 Buscando fotos do Firestore...');
          const photosRef = collection(db, 'photos');
          const q = query(photosRef, orderBy('order', 'asc'));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const firestorePhotos: Photo[] = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                name: data.name,
                src: data.url, // Firestore usa 'url', mas Photo type usa 'src'
                filter: data.category // Firestore usa 'category', mas Photo type usa 'filter'
              };
            });

            console.log(`✅ ${firestorePhotos.length} fotos carregadas do Firestore`);
            setPhotos(firestorePhotos);
            generateFilters(firestorePhotos);
            setIsLoading(false);
            return; // ✅ Sucesso! Não precisa tentar JSON
          }
        } catch (firestoreError) {
          console.warn('⚠️ Firestore indisponível, tentando JSON fallback:', firestoreError);
        }

        // 📄 FALLBACK 1: Tentar JSON estático
        try {
          console.log('📄 Tentando carregar do JSON...');
          const response = await fetch('/json/photos.json');
          
          if (response.ok) {
            const data: Photo[] = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
              console.log(`✅ ${data.length} fotos carregadas do JSON`);
              setPhotos(data);
              generateFilters(data);
              setError('⚠️ Usando dados do JSON (Firestore offline)');
              setIsLoading(false);
              return;
            }
          }
        } catch (jsonError) {
          console.warn('⚠️ JSON também falhou:', jsonError);
        }

        // 🆘 FALLBACK 2: Usar fotos hardcoded
        console.log('🆘 Usando fotos de emergência (hardcoded)');
        setPhotos(fallbackPhotos);
        generateFilters(fallbackPhotos);
        setError('⚠️ Usando imagens de demonstração');

      } catch (err) {
        console.error('❌ Erro crítico ao carregar fotos:', err);
        setPhotos(fallbackPhotos);
        generateFilters(fallbackPhotos);
        setError('❌ Erro ao carregar fotos, usando demonstração');
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
    // O label "Todos" será traduzido no componente Filters
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