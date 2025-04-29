// Adicionar ao arquivo js/script.js
$(document).ready(function() {
  // Verificar se é um dispositivo móvel
  const isMobile = window.matchMedia("(max-width: 768px)").matches ||
                  'ontouchstart' in window ||
                  navigator.maxTouchPoints > 0;
  
  if (isMobile) {
      console.log("Dispositivo móvel detectado, aplicando configurações específicas");
      
      // Melhorar performance geral em dispositivos móveis
      $('.grid-item').css('will-change', 'transform');
      
      // Adicionar atributo de acessibilidade para indicar que é tocável
      $('.grid-item').attr('role', 'button');
  }
  
  // Adicionar eventos de navegação para o Magnific Popup
  $(document).on('mfpOpen', function() {
      // Adicionar suporte a gestos de swipe para navegar entre fotos
      const container = document.querySelector('.mfp-container');
      
      if (container && isMobile) {
          let startX, startY, distX, distY;
          
          container.addEventListener('touchstart', function(e) {
              startX = e.touches[0].clientX;
              startY = e.touches[0].clientY;
          });
          
          container.addEventListener('touchmove', function(e) {
              if (!startX || !startY) return;
              
              distX = e.touches[0].clientX - startX;
              distY = e.touches[0].clientY - startY;
              
              // Se o movimento horizontal for maior que o vertical, prevenir scroll
              if (Math.abs(distX) > Math.abs(distY)) {
                  e.preventDefault();
              }
          });
          
          container.addEventListener('touchend', function(e) {
              if (!startX || !startY) return;
              
              distX = e.changedTouches[0].clientX - startX;
              distY = e.changedTouches[0].clientY - startY;
              
              // Se o movimento foi principalmente horizontal e maior que 50px
              if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
                  if (distX > 0) {
                      // Swipe para direita - imagem anterior
                      $.magnificPopup.instance.prev();
                  } else {
                      // Swipe para esquerda - próxima imagem
                      $.magnificPopup.instance.next();
                  }
              }
              
              startX = startY = null;
          });
      }
  });
});