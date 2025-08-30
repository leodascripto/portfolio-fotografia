/**
 * Módulo de Tema
 * Gerencia o tema claro/escuro
 */

const Theme = (function() {
  'use strict';
  
  let currentTheme = 'dark';
  
  /**
   * Inicializa o módulo de tema
   */
  function init() {
    loadSavedTheme();
    setupEventListeners();
  }
  
  /**
   * Carrega o tema salvo
   */
  function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      currentTheme = savedTheme;
      if (savedTheme === 'light') {
        $('body').addClass('light-mode');
        updateToggleIcon(true);
      }
    }
  }
  
  /**
   * Configura os event listeners
   */
  function setupEventListeners() {
    $('.theme-toggle').on('click', function() {
      toggleTheme();
    });
  }
  
  /**
   * Alterna entre tema claro e escuro
   */
  function toggleTheme() {
    const $body = $('body');
    const isLight = $body.hasClass('light-mode');
    
    if (isLight) {
      $body.removeClass('light-mode');
      currentTheme = 'dark';
      updateToggleIcon(false);
    } else {
      $body.addClass('light-mode');
      currentTheme = 'light';
      updateToggleIcon(true);
    }
    
    // Salvar preferência
    localStorage.setItem('theme', currentTheme);
    
    // Atualizar layout da galeria
    if (window.Gallery) {
      setTimeout(function() {
        Gallery.updateLayout();
      }, 300);
    }
  }
  
  /**
   * Atualiza o ícone do botão de tema
   */
  function updateToggleIcon(isLight) {
    const $icon = $('.theme-toggle i');
    
    if (isLight) {
      $icon.removeClass('fa-sun-o').addClass('fa-moon-o');
    } else {
      $icon.removeClass('fa-moon-o').addClass('fa-sun-o');
    }
  }
  
  /**
   * Obtém o tema atual
   */
  function getCurrentTheme() {
    return currentTheme;
  }
  
  // API pública
  return {
    init: init,
    toggle: toggleTheme,
    getCurrentTheme: getCurrentTheme
  };
})();

// Inicializar quando o documento estiver pronto
$(document).ready(function() {
  Theme.init();
});