/**
 * Gallery Core Module
 * Improved version of gallery loading and management
 */

const Gallery = (function() {
    // Configuration
    const config = {
      container: '#container',
      itemSelector: '.grid-item',
      filterSelector: '.filters li a',
      animationSpeed: 300,
      paginationItems: 12,
      defaultFilter: '*'
    };
    
    // State management
    let state = {
      isotope: null,
      currentFilter: '*',
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      itemsLoaded: 0,
      totalItems: 0,
      categories: new Set()
    };
    
    // Cache DOM elements
    const container = document.querySelector(config.container);
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    /**
     * Initialize the gallery
     * @param {Object} options - Override default configuration
     */
    function initialize(options = {}) {
      // Merge options with default config
      Object.assign(config, options);
      
      // Start loading
      showLoader();
      
      // Load photos and initialize gallery
      return loadPhotos()
        .then(data => {
          createGalleryItems(data);
          initializeIsotope();
          setupEventListeners();
          setupFilters();
          
          // Hide loader when everything is ready
          hideLoader();
          return state;
        })
        .catch(error => {
          console.error('Gallery initialization error:', error);
          showErrorMessage('Failed to load gallery. Please try again later.');
          hideLoader();
        });
    }
    
    /**
     * Load photos from JSON
     * @returns {Promise<Array>} Photos data
     */
    function loadPhotos() {
      return new Promise((resolve, reject) => {
        fetch('json/photos.json')
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load photos: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            // Process and validate data
            const validData = data.filter(item => item && item.src && item.filter);
            
            // Update state
            state.totalItems = validData.length;
            
            // Extract categories for dynamic filter creation
            validData.forEach(item => {
              if (item.filter) {
                state.categories.add(item.filter);
              }
            });
            
            resolve(validData);
          })
          .catch(error => {
            console.error('Error loading photos:', error);
            // Try fallback data
            loadFallbackPhotos()
              .then(resolve)
              .catch(reject);
          });
      });
    }
    
    /**
     * Load fallback photos if main JSON fails
     * @returns {Promise<Array>} Fallback photos data
     */
    function loadFallbackPhotos() {
      return Promise.resolve([
        { name: "Débora", src: "https://i.ibb.co/SxSv6cY/c73b09db7e992cf19e904c273fc0da6a.jpg", filter: "debora" },
        { name: "Gustavo", src: "https://i.ibb.co/mqzGrSc/1714166687091-2.jpg", filter: "gustavo" },
        { name: "Fernanda", src: "https://i.ibb.co/TmwLKgd/1717383827414-1.jpg", filter: "fernanda" },
        { name: "Akira", src: "https://i.ibb.co/0DNJf75/ef03e1e1a7d3041c30a4b248196a0228.jpg", filter: "akira" },
        { name: "Leo Oli", src: "https://i.ibb.co/gzsg2HL/c1f322153045747e8c0ae38e817867ef.jpg", filter: "leooli" },
        { name: "Lisa", src: "https://i.ibb.co/s2B7x0K/1715149773368-3.jpg", filter: "lisa" }
      ]);
    }
    
    /**
     * Create gallery items from photo data
     * @param {Array} photos - Photo data
     */
    function createGalleryItems(photos) {
      if (!container) return;
      
      // Clear container
      container.innerHTML = '';
      
      // Create fragments for better performance
      const fragment = document.createDocumentFragment();
      
      photos.forEach((item, index) => {
        // Verify image path and fix if needed
        const imgSrc = verifyImagePath(item.src);
        
        // Create grid item
        const gridItem = document.createElement('div');
        gridItem.className = `grid-item ${item.filter}`;
        gridItem.setAttribute('data-filter', item.filter);
        gridItem.setAttribute('data-index', index.toString());
        
        // Create anchor and image
        const anchor = document.createElement('a');
        anchor.className = 'popupimg';
        anchor.href = imgSrc;
        anchor.setAttribute('aria-label', `View photo of ${item.name} in full size`);
        
        const img = document.createElement('img');
        // Only set data-src for lazy loading
        img.setAttribute('data-src', imgSrc);
        img.alt = item.name;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.textContent = item.name;
        
        // Assemble elements
        anchor.appendChild(img);
        gridItem.appendChild(anchor);
        gridItem.appendChild(overlay);
        fragment.appendChild(gridItem);
        
        state.itemsLoaded++;
      });
      
      // Add all items at once for better performance
      container.appendChild(fragment);
    }
    
    /**
     * Initialize Isotope for layout and filtering
     */
    function initializeIsotope() {
      if (!container) return;
      
      // Initialize with imagesLoaded to avoid layout issues
      imagesLoaded(container, function() {
        state.isotope = new Isotope(container, {
          itemSelector: config.itemSelector,
          layoutMode: 'masonry',
          masonry: {
            columnWidth: '.grid-item',
            gutter: 15,
            fitWidth: true
          },
          percentPosition: true,
          stagger: 30,
          transitionDuration: '0.4s',
          // Add reveal animation
          visibleStyle: { 
            transform: 'translateY(0)',
            opacity: 1 
          },
          hiddenStyle: { 
            transform: 'translateY(50px)',
            opacity: 0 
          }
        });
        
        // Force layout after a small delay
        setTimeout(() => {
          if (state.isotope) {
            state.isotope.layout();
          }
        }, 100);
      });
    }
    
    /**
     * Set up event listeners for gallery
     */
    function setupEventListeners() {
      // Filter click events
      document.querySelectorAll(config.filterSelector).forEach(filter => {
        filter.addEventListener('click', handleFilterClick);
      });
      
      // Magnific Popup initialization
      setupImageViewer();
      
      // Keyboard navigation support
      document.addEventListener('keydown', handleKeyboardNavigation);
      
      // Handle resize events for layout adjustments
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (state.isotope) {
            state.isotope.layout();
          }
        }, 150);
      });
      
      // Window load event to ensure all images are properly sized
      window.addEventListener('load', () => {
        if (state.isotope) {
          state.isotope.layout();
        }
      });
    }
    
    /**
     * Set up filter buttons from categories
     */
    function setupFilters() {
      const filtersContainer = document.querySelector('.filters ul');
      if (!filtersContainer) return;
      
      // If we are using dynamic categories from data
      if (state.categories.size > 0 && filtersContainer.children.length <= 1) {
        // Create "All" filter if it doesn't exist
        if (!filtersContainer.querySelector('[data-filter="*"]')) {
          const allFilter = createFilterElement('*', 'All', true);
          filtersContainer.appendChild(allFilter);
        }
        
        // Create filters for each category
        state.categories.forEach(category => {
          if (!filtersContainer.querySelector(`[data-filter=".${category}"]`)) {
            // Capitalize first letter for display
            const displayName = category.charAt(0).toUpperCase() + category.slice(1);
            const filterElement = createFilterElement(`.${category}`, displayName, false);
            filtersContainer.appendChild(filterElement);
          }
        });
      }
      
      // Set up ARIA attributes
      updateFilterAriaStatus(config.defaultFilter);
    }
    
    /**
     * Create a filter element
     * @param {string} filterValue - Filter selector value
     * @param {string} displayName - Display name
     * @param {boolean} isActive - Whether this filter is active
     * @returns {HTMLElement} - The filter element
     */
    function createFilterElement(filterValue, displayName, isActive) {
      const li = document.createElement('li');
      if (isActive) li.classList.add('active');
      
      const a = document.createElement('a');
      a.href = 'javascript:void(0);';
      a.setAttribute('data-filter', filterValue);
      a.setAttribute('role', 'button');
      a.setAttribute('aria-current', isActive ? 'true' : 'false');
      a.setAttribute('tabindex', '0');
      a.textContent = displayName;
      
      a.addEventListener('click', handleFilterClick);
      
      li.appendChild(a);
      return li;
    }
    
    /**
     * Handle filter click event
     * @param {Event} event - Click event
     */
    function handleFilterClick(event) {
      event.preventDefault();
      
      const filterValue = this.getAttribute('data-filter');
      
      // Don't do anything if the current filter is clicked again
      if (filterValue === state.currentFilter) return;
      
      // Show loading indicator during filtering
      showLoader();
      
      // Update active class on filter buttons
      document.querySelectorAll(config.filterSelector).forEach(filter => {
        filter.parentElement.classList.remove('active');
        filter.setAttribute('aria-current', 'false');
      });
      this.parentElement.classList.add('active');
      this.setAttribute('aria-current', 'true');
      
      // Update state
      state.currentFilter = filterValue;
      
      // Apply filter with a small delay for smoother UI
      setTimeout(() => {
        if (state.isotope) {
          state.isotope.arrange({ filter: filterValue });
          
          // Update Magnific Popup after filtering
          setTimeout(setupImageViewer, 300);
        }
        
        hideLoader();
      }, 50);
    }
    
    /**
     * Set up Magnific Popup for image viewing
     */
    function setupImageViewer() {
      $('.popupimg').magnificPopup({
        type: 'image',
        gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0, 1],
          tPrev: 'Previous',
          tNext: 'Next',
          tCounter: '%curr% of %total%'
        },
        image: {
          titleSrc: function(item) {
            // Get name from overlay
            const gridItem = item.el.closest('.grid-item');
            if (gridItem) {
              const overlay = gridItem.querySelector('.overlay');
              if (overlay) {
                return overlay.textContent;
              }
            }
            return '';
          }
        },
        callbacks: {
          open: function() {
            // Add ARIA attributes for accessibility
            $('.mfp-container').attr('role', 'dialog');
            $('.mfp-content').attr('aria-live', 'polite');
            
            // Add swipe indicators for mobile
            addSwipeIndicators();
          },
          close: function() {
            // Remove swipe indicators
            removeSwipeIndicators();
          }
        }
      });
    }
    
    /**
     * Add swipe indicators for mobile
     */
    function addSwipeIndicators() {
      if (!window.matchMedia('(max-width: 768px)').matches) return;
      
      const container = document.querySelector('.mfp-container');
      if (!container) return;
      
      // Create indicators
      const leftIndicator = document.createElement('div');
      leftIndicator.className = 'swipe-indicator left';
      leftIndicator.innerHTML = '<i class="fa fa-chevron-left"></i>';
      
      const rightIndicator = document.createElement('div');
      rightIndicator.className = 'swipe-indicator right';
      rightIndicator.innerHTML = '<i class="fa fa-chevron-right"></i>';
      
      container.appendChild(leftIndicator);
      container.appendChild(rightIndicator);
      
      // Show instructions briefly
      const instructions = document.createElement('div');
      instructions.className = 'gallery-instructions';
      instructions.innerHTML = '<p>Swipe to navigate between photos</p>';
      container.appendChild(instructions);
      
      setTimeout(() => {
        instructions.style.opacity = '0';
        setTimeout(() => {
          instructions.remove();
        }, 500);
      }, 2000);
    }
    
    /**
     * Remove swipe indicators
     */
    function removeSwipeIndicators() {
      document.querySelectorAll('.swipe-indicator, .gallery-instructions').forEach(el => {
        el.remove();
      });
    }
    
    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeyboardNavigation(event) {
      // Check if Magnific Popup is open
      if ($.magnificPopup && $.magnificPopup.instance.isOpen) {
        // Left arrow - previous image
        if (event.key === 'ArrowLeft') {
          $.magnificPopup.instance.prev();
        }
        // Right arrow - next image
        else if (event.key === 'ArrowRight') {
          $.magnificPopup.instance.next();
        }
        // Escape - close gallery
        else if (event.key === 'Escape') {
          $.magnificPopup.instance.close();
        }
      }
      // Filter navigation with keyboard
      else if (event.key === 'Tab' && event.target.closest(config.filterSelector)) {
        // Highlight current filter
        const filterElement = event.target.closest(config.filterSelector);
        updateFilterAriaStatus(filterElement.getAttribute('data-filter'));
      }
    }
    
    /**
     * Update ARIA status for filters
     * @param {string} activeFilter - Active filter value
     */
    function updateFilterAriaStatus(activeFilter) {
      document.querySelectorAll(config.filterSelector).forEach(filter => {
        const filterValue = filter.getAttribute('data-filter');
        const isCurrent = filterValue === activeFilter;
        
        filter.setAttribute('aria-current', isCurrent ? 'true' : 'false');
        filter.parentElement.classList.toggle('active', isCurrent);
      });
    }
    
    /**
     * Verify and fix image path if needed
     * @param {string} src - Image source path
     * @returns {string} - Verified path
     */
    function verifyImagePath(src) {
      // External URLs are returned as-is
      if (src.includes('http://') || src.includes('https://')) {
        return src;
      }
      
      // Return path as-is if it starts with assets/
      if (src.startsWith('assets/')) {
        return src;
      }
      
      // Add assets/ prefix if not present
      return src;
    }
    
    /**
     * Show loading indicator
     */
    function showLoader() {
      state.isLoading = true;
      if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
      }
    }
    
    /**
     * Hide loading indicator
     */
    function hideLoader() {
      state.isLoading = false;
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
    }
    
    /**
     * Show error message to user
     * @param {string} message - Error message
     */
    function showErrorMessage(message) {
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      
      if (container) {
        container.innerHTML = '';
        container.appendChild(errorElement);
      }
    }
    
    /**
     * Public API
     */
    return {
      initialize,
      filter: function(category) {
        const filterEl = document.querySelector(`${config.filterSelector}[data-filter=".${category}"]`);
        if (filterEl) {
          filterEl.click();
        }
      },
      refresh: function() {
        if (state.isotope) {
          state.isotope.layout();
        }
      },
      getState: function() {
        return { ...state };
      }
    };
  })();
  
  // Usage example
  // document.addEventListener('DOMContentLoaded', () => {
  //   Gallery.initialize();
  // });