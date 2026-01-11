// scripts/fix-category-names.ts
// Execute este script UMA VEZ para corrigir categorias existentes

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function fixCategoryNames() {
  console.log('🔧 Iniciando correção de nomes de categorias...');
  
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    let fixed = 0;
    let skipped = 0;
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const docId = docSnap.id;
      
      console.log(`\n📋 Categoria: ${docId}`);
      console.log(`   Nome atual: "${data.name}"`);
      console.log(`   Ícone: ${data.icon}`);
      
      // ✅ Se o name for igual ao ID (bug), pede para o usuário corrigir
      if (data.name === docId || data.name.length > 30) {
        console.log(`   ⚠️ BUG DETECTADO! Nome é o ID do Firestore`);
        
        // Você pode descomentar e ajustar manualmente aqui:
        /*
        await updateDoc(doc(db, 'categories', docId), {
          name: 'Nome Correto Aqui',
          icon: data.icon || '📁'
        });
        fixed++;
        console.log(`   ✅ CORRIGIDO!`);
        */
        
        console.log(`   ℹ️ Para corrigir, edite manualmente no dashboard`);
        skipped++;
      } else {
        console.log(`   ✅ OK - Nome está correto`);
        skipped++;
      }
    }
    
    console.log(`\n\n📊 Relatório Final:`);
    console.log(`   ✅ Corrigidas: ${fixed}`);
    console.log(`   ⏭️ Puladas: ${skipped}`);
    console.log(`   📝 Total: ${snapshot.size}`);
    
  } catch (error) {
    console.error('❌ Erro ao corrigir categorias:', error);
    throw error;
  }
}

// Para executar no console do navegador:
// 1. Abra o dashboard admin
// 2. Abra o Console (F12)
// 3. Execute: fixCategoryNames()

if (typeof window !== 'undefined') {
  (window as any).fixCategoryNames = fixCategoryNames;
}