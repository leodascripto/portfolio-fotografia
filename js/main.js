/**
 * Leo Oli Photography Portfolio
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize core modules
    const app = {
      // Cache frequently used elements
      elements: {
        container: document.querySelector('#container'),
        loader: document.querySelector('.loading-indicator'),
        filters: document.querySelector('.filters'),
        header: document.querySelector('.header'),
        logo: document.querySelector('#logo')
      },
      
      // Module references
      gallery: null,
      theme: null,
      lazyLoader: null,
      
      /**
       * Initialize application
       */
      init: function() {
        console.log('Initializing portfolio application...');
        
        // Check environment capabilities
        this.checkEnvironment();
        
        // Initialize modules
        this.initModules();
        
        // Add enhanced UI elements
        this.setupEnhancedUI();
        
        // Add event listeners
        this.setupEventListeners();
        
        console.log('Portfolio application initialized successfully');
      },
      
      /**
       * Check environment capabilities and browser support
       */
      checkEnvironment: function() {
        // Feature detection
        const features = {
          localStorage: this.checkLocalStorage(),
          webpSupport: this.checkWebpSupport(),
          intersection: 'IntersectionObserver' in window,
          touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        };
        
        // Apply appropriate classes to document
        if (features.touch) {
          document.documentElement.classList.add('is-touch-device');
        }
        
        if (!features.intersection) {
          document.documentElement.classList.add('no-intersection-observer');
        }
        
        if (features.webpSupport) {
          document.documentElement.classList.add('webp-support');
        }
        
        return features;
      },
      
      /**
       * Check if localStorage is available
       */
      checkLocalStorage: function() {
        try {
          const test = 'test';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch (e) {
          return false;
        }
      },
      
      /**
       * Check WebP support for potential image optimizations
       */
      checkWebpSupport: function() {
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
          return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
      },
      
      /**
       * Initialize application modules
       */
      initModules: function() {
        // Initialize theme manager
        this.theme = ThemeManager;
        this.theme.initialize();
        
        // Initialize lazy loading
        this.lazyLoader = LazyLoader;
        this.lazyLoader.initialize();
        
        // Initialize gallery
        this.gallery = Gallery;
        this.gallery.initialize({
          onFilterChange: () => {
            // Refresh lazy loading after filter change
            setTimeout(() => {
              this.lazyLoader.refresh();
            }, 500);
          }
        });
      },
      
      /**
       * Set up enhanced UI elements
       */
      setupEnhancedUI: function() {
        // Add logo animation
        this.setupLogoAnimation();
        
        // Initialize mobile optimization
        this.initMobileOptimization();
        
        // Add scroll animations
        this.setupScrollAnimations();
        
        // Set up WhatsApp link
        this.setupContactLink();
      },
      
      /**
       * Set up logo animation
       */
      setupLogoAnimation: function() {
        const logo = this.elements.logo;
        if (!logo) return;
        
        // Add subtle animation when logo comes into view
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              logo.classList.add('animated');
              observer.unobserve(logo);
            }
          });
        }, { threshold: 0.3 });
        
        observer.observe(logo);
        
        // Add hover animation
        logo.addEventListener('mouseenter', function() {
          this.classList.add('hover');
        });
        
        logo.addEventListener('mouseleave', function() {
          this.classList.remove('hover');
        });
      },
      
      /**
       * Initialize mobile optimizations
       */
      initMobileOptimization: function() {
        // Check if it's a mobile device
        if (!window.matchMedia('(max-width: 768px)').matches) return;
        
        // Optimize touch areas
        document.querySelectorAll('.filters li a, .grid-item, [role="button"]').forEach(item => {
          item.classList.add('touch-optimized');
        });
        
        // Add instructions for mobile users
        this.showMobileInstructions();
        
        // Make filter navigation scrollable with visual cue
        this.setupScrollableFilters();
      },
      
      /**
       * Show instructions for mobile users
       */
      showMobileInstructions: function() {
        // Check if user has seen instructions before
        try {
          if (localStorage.getItem('instructionsShown')) return;
        } catch (e) {
          // Ignore localStorage errors
        }
        
        const instructions = document.querySelector('.mobile-instructions');
        if (!instructions) return;
        
        // Show instructions with animation
        instructions.style.display = 'block';
        instructions.classList.add('animated');
        
        // Hide after 5 seconds
        setTimeout(() => {
          instructions.classList.add('hiding');
          
          setTimeout(() => {
            instructions.style.display = 'none';
          }, 500);
        }, 5000);
        
        // Mark as shown
        try {
          localStorage.setItem('instructionsShown', 'true');
        } catch (e) {
          // Ignore localStorage errors
        }
      },
      
      /**
       * Make filter navigation scrollable with visual cue
       */
      setupScrollableFilters: function() {
        const filters = this.elements.filters;
        if (!filters) return;
        
        const filtersList = filters.querySelector('ul');
        if (!filtersList) return;
        
        // Check if scrollable
        if (filtersList.scrollWidth > filtersList.clientWidth) {
          filters.classList.add('scrollable');
          
          // Add scroll indicators
          const leftIndicator = document.createElement('div');
          leftIndicator.className = 'scroll-indicator left';
          leftIndicator.innerHTML = '<i class="fa fa-chevron-left"></i>';
          
          const rightIndicator = document.createElement('div');
          rightIndicator.className = 'scroll-indicator right';
          rightIndicator.innerHTML = '<i class="fa fa-chevron-right"></i>';
          
          filters.appendChild(leftIndicator);
          filters.appendChild(rightIndicator);
          
          // Update indicators based on scroll position
          filtersList.addEventListener('scroll', function() {
            const isScrolledLeft = this.scrollLeft > 20;
            const isScrolledRight = this.scrollLeft < (this.scrollWidth - this.clientWidth - 20);
            
            leftIndicator.classList.toggle('visible', isScrolledLeft);
            rightIndicator.classList.toggle('visible', isScrolledRight);
          });
          
          // Initial update
          filtersList.dispatchEvent(new Event('scroll'));
          
          // Add click handlers for indicators
          leftIndicator.addEventListener('click', function() {
            filtersList.scrollBy({ left: -100, behavior: 'smooth' });
          });
          
          rightIndicator.addEventListener('click', function() {
            filtersList.scrollBy({ left: 100, behavior: 'smooth' });
          });
        }
      },
      
      /**
       * Set up animations on scroll
       */
      setupScrollAnimations: function() {
        if (!('IntersectionObserver' in window)) return;
        
        // Animate elements when they enter viewport
        const animationObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
              animationObserver.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '0px 0px -50px 0px',
          threshold: 0.1
        });
        
        // Observe grid items
        document.querySelectorAll('.grid-item').forEach(item => {
          item.classList.add('animate-on-scroll');
          animationObserver.observe(item);
        });
        
        // Observe header elements
        document.querySelectorAll('.header h1, .header .portfolio').forEach(item => {
          item.classList.add('animate-on-scroll');
          animationObserver.observe(item);
        });
      },
      
      /**
       * Set up contact link functionality
       */
      setupContactLink: function() {
        const whatsappLink = document.querySelector('.float');
        if (!whatsappLink) return;
        
        // Add tracking for analytics
        whatsappLink.addEventListener('click', function() {
          // Track contact click if analytics exists
          if (typeof gtag === 'function') {
            gtag('event', 'contact', {
              'event_category': 'engagement',
              'event_label': 'whatsapp'
            });
          }
          
          // Add visual feedback
          this.classList.add('clicked');
          setTimeout(() => {
            this.classList.remove('clicked');
          }, 300);
        });
      },
      
      /**
       * Set up global event listeners
       */
      setupEventListeners: function() {
        // Refresh layout on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            // Re-layout gallery
            if (this.gallery) {
              this.gallery.refresh();
            }
            
            // Update mobile optimizations
            this.initMobileOptimization();
          }, 150);
        });
        
        // Fade out initial loader
        window.addEventListener('load', () => {
          const loader = this.elements.loader;
          if (loader) {
            loader.classList.add('fadeout');
            setTimeout(() => {
              loader.style.display = 'none';
            }, 500);
          }
        });
        
        // Accessibility support for keyboard navigation
        document.addEventListener('keydown', function(e) {
          // Add class when Tab key is pressed
          if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
          }
        });
        
        document.addEventListener('mousedown', function() {
          document.body.classList.remove('keyboard-navigation');
        });
      },
      
      /**
       * Handle errors gracefully
       */
      handleError: function(error, context) {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message for critical errors
        if (context === 'initialization' || context === 'gallery') {
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-message';
          errorMessage.textContent = 'Something went wrong while loading the gallery. Please try refreshing the page.';
          
          const container = this.elements.container;
          if (container) {
            container.innerHTML = '';
            container.appendChild(errorMessage);
          }
        }
      }
    };
    
    // Initialize application
    try {
      app.init();
    } catch (error) {
      app.handleError(error, 'initialization');
    }
  });
  
  /**
   * Additional CSS styles for new features
   * These will be added at runtime to avoid modifying CSS files
   */
  (function() {
    const addedStyles = `
      /* Enhanced animations */
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      
      .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Logo animations */
      #logo {
        transition: transform 0.4s ease;
      }
      
      #logo.animated {
        animation: logoReveal 1s ease forwards;
      }
      
      #logo.hover {
        transform: scale(1.05);
      }
      
      @keyframes logoReveal {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      /* Lazy loading styles */
      .grid-item {
        position: relative;
        background-color: rgba(40, 40, 40, 0.3);
      }
      
      .grid-item img.lazy {
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      
      .grid-item img.loaded {
        opacity: 1;
      }
      
      .image-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, rgba(40, 40, 40, 0.5) 25%, rgba(60, 60, 60, 0.5) 50%, rgba(40, 40, 40, 0.5) 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        z-index: 1;
        pointer-events: none;
        border-radius: var(--grid-radius);
      }
      
      .grid-item.loaded .image-placeholder {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      /* Mobile filter improvements */
      .filters.scrollable {
        position: relative;
      }
      
      .scroll-indicator {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        background-color: rgba(35, 35, 35, 0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        pointer-events: none;
      }
      
      .scroll-indicator.visible {
        opacity: 0.9;
        pointer-events: all;
      }
      
      .scroll-indicator.left {
        left: 5px;
      }
      
      .scroll-indicator.right {
        right: 5px;
      }
      
      .scroll-indicator i {
        color: var(--primary-gold);
        font-size: 16px;
      }
      
      /* Touch optimizations */
      .touch-optimized {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      /* Enhanced accessibility */
      body.keyboard-navigation a:focus,
      body.keyboard-navigation button:focus,
      body.keyboard-navigation [role="button"]:focus,
      body.keyboard-navigation [tabindex="0"]:focus {
        outline: 3px solid var(--primary-gold);
        outline-offset: 3px;
      }
      
      /* Swipe indicators in gallery */
      .swipe-indicator {
        position: absolute;
        top: 50%;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-50%);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 100;
      }
      
      .swipe-indicator i {
        color: white;
        font-size: 18px;
      }
      
      .swipe-indicator.left {
        left: 20px;
      }
      
      .swipe-indicator.right {
        right: 20px;
      }
      
      .swipe-indicator.active {
        opacity: 0.8;
      }
      
      .gallery-instructions {
        position: absolute;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        text-align: center;
        z-index: 100;
        transition: opacity 0.5s ease;
      }
      
      /* Loading animation improvements */
      .loading-indicator {
        animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
      }
      
      .loading-indicator.fadeout {
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(227, 202, 102, 0.5); }
        50% { box-shadow: 0 0 0 10px rgba(227, 202, 102, 0); }
      }
      
      /* Mobile instruction improvements */
      .mobile-instructions {
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      
      .mobile-instructions.animated {
        animation: slideUp 0.5s ease forwards;
      }
      
      .mobile-instructions.hiding {
        opacity: 0;
        transform: translateY(20px);
      }
      
      @keyframes slideUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      /* WhatsApp button enhancement */
      .float.clicked {
        transform: scale(1.2) rotate(10deg);
      }
      
      /* Animated grid items */
      .grid-item {
        transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
      }
      
      .grid-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      }
      
      .grid-item.error::after {
        content: '⚠️';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        z-index: 2;
      }
      
      /* Enhanced theme toggle */
      .theme-toggle {
        transition: transform 0.3s ease, background-color 0.3s ease;
      }
      
      .theme-toggle:hover {
        transform: rotate(30deg);
        background-color: rgba(40, 40, 40, 0.9);
      }
      
      /* Screen reader only content */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    
    // Add styles to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = addedStyles;
    document.head.appendChild(styleElement);
  })();
  