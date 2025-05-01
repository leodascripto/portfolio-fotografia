/**
 * Advanced Lazy Loading Module for Leo Oli Photography Portfolio
 * Handles efficient image loading with IntersectionObserver API
 */

const LazyLoader = (function() {
    // Configuration
    const config = {
      rootMargin: '50px 0px',
      threshold: 0.1,
      placeholderColor: '#2a2a2a'
    };
    
    // Cache DOM elements and variables
    let observer;
    let loadedImages = new Set();
    
    /**
     * Initialize lazy loading
     * @param {string} selector - CSS selector for images to lazy load
     */
    function initialize(selector = '.grid-item img') {
      if (!('IntersectionObserver' in window)) {
        fallbackLoad(selector);
        return;
      }
      
      setupObserver(selector);
      setupPlaceholders(selector);
    }
    
    /**
     * Set up IntersectionObserver
     * @param {string} selector - CSS selector for images
     */
    function setupObserver(selector) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src && !loadedImages.has(src)) {
              loadImage(img, src);
              observer.unobserve(img);
            }
          }
        });
      }, config);
      
      // Observe all target images
      document.querySelectorAll(selector).forEach(img => {
        observer.observe(img);
      });
    }
    
    /**
     * Set up placeholder and transform images for lazy loading
     * @param {string} selector - CSS selector for images
     */
    function setupPlaceholders(selector) {
      document.querySelectorAll(selector).forEach(img => {
        // Skip if already processed
        if (img.hasAttribute('data-src')) return;
        
        // Store original src
        const originalSrc = img.src;
        img.setAttribute('data-src', originalSrc);
        
        // Set placeholder
        img.src = createPlaceholder();
        
        // Add loading UI
        const parent = img.closest('.grid-item');
        if (parent) {
          const placeholder = document.createElement('div');
          placeholder.className = 'image-placeholder';
          parent.appendChild(placeholder);
        }
        
        // Add loading class
        img.classList.add('lazy');
      });
    }
    
    /**
     * Load image and show animation
     * @param {HTMLImageElement} img - Image element
     * @param {string} src - Image source URL
     */
    function loadImage(img, src) {
      // Prevent double loading
      if (loadedImages.has(src)) return;
      
      const tempImage = new Image();
      const parent = img.closest('.grid-item');
      const placeholder = parent ? parent.querySelector('.image-placeholder') : null;
      
      // Add loading state
      if (parent) parent.classList.add('loading');
      
      tempImage.onload = function() {
        // Update the real image
        img.src = src;
        img.classList.add('loaded');
        
        // Animation and cleanup
        if (parent) {
          // Show the image with animation
          parent.classList.remove('loading');
          parent.classList.add('loaded');
          
          // Remove placeholder after animation
          if (placeholder) {
            setTimeout(() => {
              placeholder.remove();
            }, 500);
          }
        }
        
        // Track loaded image
        loadedImages.add(src);
      };
      
      tempImage.onerror = function() {
        console.error('Failed to load image:', src);
        // Show error state
        if (parent) {
          parent.classList.remove('loading');
          parent.classList.add('error');
        }
      };
      
      // Start loading
      tempImage.src = src;
    }
    
    /**
     * Create a tiny placeholder image
     * @returns {string} Data URL for placeholder
     */
    function createPlaceholder() {
      // Simple colored 1×1 pixel placeholder
      return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect width="1" height="1" fill="${config.placeholderColor.replace('#', '%23')}"%3E%3C/rect%3E%3C/svg%3E`;
    }
    
    /**
     * Fallback for browsers without IntersectionObserver
     * @param {string} selector - CSS selector for images
     */
    function fallbackLoad(selector) {
      document.querySelectorAll(selector).forEach(img => {
        const src = img.getAttribute('data-src') || img.src;
        img.src = src;
      });
    }
    
    /**
     * Refresh lazy loading (e.g., after loading new images)
     * @param {string} selector - CSS selector for images
     */
    function refresh(selector = '.grid-item img:not(.loaded)') {
      if (observer) {
        // Find new unobserved images
        document.querySelectorAll(selector).forEach(img => {
          // Check if not already processed
          if (!img.classList.contains('loaded') && !img.classList.contains('lazy')) {
            setupPlaceholders(selector);
            observer.observe(img);
          }
        });
      }
    }
    
    /**
     * Stop and cleanup lazy loading
     */
    function destroy() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
    
    // Public API
    return {
      initialize,
      refresh,
      destroy
    };
  })();
  
  // Usage in main.js
  // document.addEventListener('DOMContentLoaded', () => {
  //   LazyLoader.initialize();
  // });