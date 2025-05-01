/**
 * Theme and Accessibility Module
 * Handles theme switching and accessibility enhancements
 */

const ThemeManager = (function() {
    // Configuration
    const config = {
      lightClass: 'light-mode',
      themeToggleSelector: '.theme-toggle',
      themeStorageKey: 'portfolioTheme',
      focusableSelectors: 'a, button, [role="button"], [tabindex="0"]',
      scrollToTopSelector: '.scroll-to-top'
    };
    
    // Track state
    let state = {
      isLightMode: false,
      hasReducedMotion: false,
      prefersColorScheme: 'dark',
      isTouch: false
    };
    
    /**
     * Initialize theme manager
     */
    function initialize() {
      // Check device capabilities
      detectDeviceCapabilities();
      
      // Check user preferences
      checkUserPreferences();
      
      // Set up event listeners
      setupEventListeners();
      
      // Initialize keyboard navigation
      enhanceKeyboardNavigation();
      
      // Add scroll to top button
      initScrollToTop();
      
      // Apply initial theme
      applyTheme();
      
      return state;
    }
    
    /**
     * Detect device capabilities and preferences
     */
    function detectDeviceCapabilities() {
      // Check for touch support
      state.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check motion preference
      state.hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check color scheme preference
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        state.prefersColorScheme = 'light';
      }
      
      // Apply appropriate classes to document
      if (state.isTouch) {
        document.documentElement.classList.add('is-touch-device');
      }
      
      if (state.hasReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      }
    }
    
    /**
     * Check for user's stored preferences
     */
    function checkUserPreferences() {
      try {
        // Check localStorage for theme preference
        const savedTheme = localStorage.getItem(config.themeStorageKey);
        
        if (savedTheme === 'light') {
          state.isLightMode = true;
        } else if (savedTheme === 'dark') {
          state.isLightMode = false;
        } else {
          // No stored preference, use system preference
          state.isLightMode = state.prefersColorScheme === 'light';
        }
      } catch (error) {
        console.warn('Error accessing localStorage:', error);
        // Fallback to system preference
        state.isLightMode = state.prefersColorScheme === 'light';
      }
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
      // Theme toggle button
      const themeToggle = document.querySelector(config.themeToggleSelector);
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        });
        
        // Set up proper attributes for accessibility
        themeToggle.setAttribute('role', 'button');
        themeToggle.setAttribute('tabindex', '0');
        themeToggle.setAttribute('aria-label', 'Toggle light/dark theme');
      }
      
      // Media query listener for system theme changes
      const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');
      if (typeof colorSchemeQuery.addEventListener === 'function') {
        colorSchemeQuery.addEventListener('change', function(e) {
          // Only update if user hasn't explicitly chosen a theme
          if (!localStorage.getItem(config.themeStorageKey)) {
            state.prefersColorScheme = e.matches ? 'light' : 'dark';
            state.isLightMode = e.matches;
            applyTheme();
          }
        });
      }
      
      // Motion preference listener
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', function(e) {
          state.hasReducedMotion = e.matches;
          document.documentElement.classList.toggle('reduced-motion', e.matches);
        });
      }
    }
    
    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
      state.isLightMode = !state.isLightMode;
      
      // Save preference
      try {
        localStorage.setItem(config.themeStorageKey, state.isLightMode ? 'light' : 'dark');
      } catch (error) {
        console.warn('Could not save theme preference:', error);
      }
      
      // Apply theme
      applyTheme();
      
      // Announce theme change for screen readers
      announceThemeChange();
    }
    
    /**
     * Apply the current theme to document
     */
    function applyTheme() {
      document.body.classList.toggle(config.lightClass, state.isLightMode);
      
      // Update theme toggle icon
      const themeToggle = document.querySelector(config.themeToggleSelector);
      if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
          if (state.isLightMode) {
            icon.className = 'fa fa-moon-o';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
          } else {
            icon.className = 'fa fa-sun-o';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
          }
        }
      }
      
      // Force Isotope re-layout if it exists
      if (typeof $.fn.isotope !== 'undefined' && $('#container').data('isotope')) {
        $('#container').isotope('layout');
      }
    }
    
    /**
     * Announce theme change for screen readers
     */
    function announceThemeChange() {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('sr-only');
      announcement.textContent = `Theme changed to ${state.isLightMode ? 'light' : 'dark'} mode`;
      
      document.body.appendChild(announcement);
      
      // Remove after announcement is read
      setTimeout(() => {
        announcement.remove();
      }, 3000);
    }
    
    /**
     * Enhance keyboard navigation for accessibility
     */
    function enhanceKeyboardNavigation() {
      // Track focus state for styling
      document.addEventListener('keydown', function(e) {
        // Add class when Tab key is pressed
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });
      
      // Remove class when mouse is used
      document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
      });
      
      // Enhanced focus for gallery items
      document.querySelectorAll('.grid-item').forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        
        // Make gallery items navigable by keyboard
        item.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const link = this.querySelector('a');
            if (link) link.click();
          }
        });
      });
      
      // Make filters accessible by keyboard
      document.querySelectorAll('.filters li a').forEach(filter => {
        filter.setAttribute('role', 'button');
        filter.setAttribute('tabindex', '0');
        
        filter.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      });
    }
    
    /**
     * Initialize scroll to top button
     */
    function initScrollToTop() {
      const scrollButton = document.querySelector(config.scrollToTopSelector);
      
      // Create button if it doesn't exist
      if (!scrollButton) {
        const button = document.createElement('div');
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.innerHTML = '<i class="fa fa-chevron-up"></i>';
        
        document.body.appendChild(button);
        
        // Add click event
        button.addEventListener('click', scrollToTop);
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
          }
        });
      } else {
        // Ensure existing button has proper attributes
        scrollButton.setAttribute('role', 'button');
        scrollButton.setAttribute('tabindex', '0');
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        
        // Add event listeners
        scrollButton.addEventListener('click', scrollToTop);
        scrollButton.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
          }
        });
      }
      
      // Show/hide button based on scroll position
      window.addEventListener('scroll', function() {
        const scrollButton = document.querySelector(config.scrollToTopSelector);
        if (!scrollButton) return;
        
        if (window.pageYOffset > 300) {
          scrollButton.classList.add('visible');
        } else {
          scrollButton.classList.remove('visible');
        }
      });
    }
    
    /**
     * Scroll to top with smooth animation
     */
    function scrollToTop() {
      const scrollOptions = {
        top: 0,
        behavior: state.hasReducedMotion ? 'auto' : 'smooth'
      };
      
      window.scrollTo(scrollOptions);
    }
    
    /**
     * Add touch-specific enhancements
     */
    function enhanceTouchInteraction() {
      if (!state.isTouch) return;
      
      // Add touch feedback effect
      document.addEventListener('touchstart', function(e) {
        // Only add feedback for interactive elements
        const target = e.target.closest(config.focusableSelectors + ', .grid-item');
        if (!target) return;
        
        // Create ripple effect
        const feedback = document.createElement('div');
        feedback.className = 'touch-feedback';
        document.body.appendChild(feedback);
        
        // Position at touch point
        const touch = e.touches[0];
        feedback.style.left = `${touch.clientX}px`;
        feedback.style.top = `${touch.clientY}px`;
        
        // Remove after animation completes
        setTimeout(() => {
          feedback.remove();
        }, 600);
      }, { passive: true });
      
      // Improved swipe detection for gallery
      setupSwipeNavigation();
    }
    
    /**
     * Set up swipe navigation for gallery
     */
    function setupSwipeNavigation() {
      document.addEventListener('DOMContentLoaded', function() {
        // Only if Magnific Popup is present
        if (typeof $.magnificPopup === 'undefined') return;
        
        // Listen for gallery open
        $(document).on('mfpOpen', function() {
          const container = document.querySelector('.mfp-container');
          if (!container) return;
          
          let touchStartX = 0;
          let touchEndX = 0;
          
          container.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
          }, { passive: true });
          
          container.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
          }, { passive: true });
          
          function handleSwipe() {
            const threshold = 50;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) < threshold) return;
            
            if (diff > 0) {
              // Swipe right - previous image
              $.magnificPopup.instance.prev();
            } else {
              // Swipe left - next image
              $.magnificPopup.instance.next();
            }
          }
        });
      });
    }
    
    // Initialize touch enhancements
    if (state.isTouch) {
      enhanceTouchInteraction();
    }
    
    /**
     * Public API
     */
    return {
      initialize,
      toggleTheme,
      getState: function() {
        return { ...state };
      },
      applyTheme
    };
  })();
  
  // Usage
  // document.addEventListener('DOMContentLoaded', () => {
  //   ThemeManager.initialize();
  // });
  