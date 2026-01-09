import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Photo, Category } from '@/types/admin';

// ============ CATEGORIAS ============
export const getCategories = async (): Promise<Category[]> => {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[];
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  const categoriesRef = collection(db, 'categories');
  const docRef = await addDoc(categoriesRef, category);
  return docRef.id;
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<void> => {
  const categoryRef = doc(db, 'categories', id);
  await updateDoc(categoryRef, data);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const categoryRef = doc(db, 'categories', id);
  await deleteDoc(categoryRef);
};

// ============ FOTOS ============
export const getPhotos = async (): Promise<Photo[]> => {
  const photosRef = collection(db, 'photos');
  const q = query(photosRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Photo[];
};

export const getPhotosByCategory = async (category: string): Promise<Photo[]> => {
  const photos = await getPhotos();
  return photos.filter(photo => photo.category === category);
};

export const createPhoto = async (photo: Omit<Photo, 'id'>): Promise<string> => {
  const photosRef = collection(db, 'photos');
  const docRef = await addDoc(photosRef, {
    ...photo,
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString()
  });
  return docRef.id;
};

export const updatePhoto = async (id: string, data: Partial<Photo>): Promise<void> => {
  const photoRef = doc(db, 'photos', id);
  await updateDoc(photoRef, {
    ...data,
    updatedAt: Timestamp.now().toDate().toISOString()
  });
};

export const deletePhoto = async (id: string): Promise<void> => {
  const photoRef = doc(db, 'photos', id);
  await deleteDoc(photoRef);
};

export const updatePhotosOrder = async (photos: { id: string; order: number }[]): Promise<void> => {
  const promises = photos.map(({ id, order }) => 
    updatePhoto(id, { order })
  );
  await Promise.all(promises);
};