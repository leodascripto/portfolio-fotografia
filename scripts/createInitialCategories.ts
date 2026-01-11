import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3ptv4Rfuulw_7xD5HVF6hOCQmqtPYi8s",
  authDomain: "leooli-portfolio.firebaseapp.com",
  projectId: "leooli-portfolio",
  storageBucket: "leooli-portfolio.firebasestorage.app",
  messagingSenderId: "992090678811",
  appId: "1:992090678811:web:910282ca01266590afbabe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  { id: 'debora', name: 'Débora', icon: '👤', order: 1 },
  { id: 'giovanna', name: 'Giovanna', icon: '✨', order: 2 },
  { id: 'lisa', name: 'Lisa', icon: '💫', order: 3 },
  { id: 'gustavo', name: 'Gustavo', icon: '🎭', order: 4 },
  { id: 'fernanda', name: 'Fernanda', icon: '🌸', order: 5 },
  { id: 'akira', name: 'Akira', icon: '⚡', order: 6 },
  { id: 'leooli', name: 'Leo Oli', icon: '📸', order: 7 },
  { id: 'mariana', name: 'Mariana', icon: '🌺', order: 8 },
  { id: 'vitoria', name: 'Vitória', icon: '👑', order: 9 }
];

async function createCategories() {
  try {
    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
      console.log(`✅ ${cat.name} criada`);
    }
    console.log('✅ Todas as categorias criadas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

createCategories();