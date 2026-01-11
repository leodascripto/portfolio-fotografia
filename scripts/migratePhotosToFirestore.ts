import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

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

const photos = [
  { name: "Débora", src: "/assets/img/portfolio/debora1.jpg", filter: "debora" },
  { name: "Débora", src: "/assets/img/portfolio/debora2.jpg", filter: "debora" },
  { name: "Giovanna", src: "/assets/img/portfolio/giovanna1.jpg", filter: "giovanna" },
  { name: "Giovanna", src: "/assets/img/portfolio/giovanna2.jpg", filter: "giovanna" },
  { name: "Giovanna", src: "/assets/img/portfolio/giovanna3.jpg", filter: "giovanna" },
  { name: "Gustavo", src: "/assets/img/portfolio/gustavo.jpg", filter: "gustavo" },
  { name: "Leo Oli", src: "/assets/img/portfolio/leooli1.jpg", filter: "leooli" },
  { name: "Leo Oli", src: "/assets/img/portfolio/leooli2.jpg", filter: "leooli" },
  { name: "Leo Oli", src: "/assets/img/portfolio/leooli3.jpg", filter: "leooli" },
  { name: "Lisa", src: "/assets/img/portfolio/lisa1.jpg", filter: "lisa" },
  { name: "Lisa", src: "/assets/img/portfolio/lisa2.jpg", filter: "lisa" },
  { name: "Lisa", src: "/assets/img/portfolio/lisa3.jpg", filter: "lisa" },
  { name: "Lisa", src: "/assets/img/portfolio/lisa4.jpg", filter: "lisa" },
  { name: "Lisa", src: "/assets/img/portfolio/lisa5.jpg", filter: "lisa" },
  { name: "Mariana", src: "/assets/img/portfolio/mariana.jpg", filter: "mariana" },
  { name: "Vitória", src: "/assets/img/portfolio/vitoria1.jpg", filter: "vitoria" },
  { name: "Vitória", src: "/assets/img/portfolio/vitoria2.jpg", filter: "vitoria" },
];

async function clearAndMigrate() {
  try {
    console.log('🗑️  Limpando fotos antigas...');
    const snapshot = await getDocs(collection(db, 'photos'));
    for (const docSnap of snapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    
    console.log(`📸 Migrando ${photos.length} fotos...`);
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const photoId = `photo_${Date.now()}_${i}`;
      
      await setDoc(doc(db, 'photos', photoId), {
        name: photo.name,
        url: photo.src,
        category: photo.filter,
        order: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ ${i + 1}/${photos.length} - ${photo.name}`);
    }
    
    console.log('🎉 Migração concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

clearAndMigrate();