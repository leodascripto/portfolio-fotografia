/**
 * Responsive Image Module for Leo Oli Photography Portfolio
 * Provides optimized image loading based on device capabilities
 */

const ResponsiveImageHandler = (function() {
    // Configuration
    const config = {
      sizes: {
        thumbnail: { width: 400, height: 400 },
        medium: { width: 800, height: 800 },
        large: { width: 1200, height: 1200 },
        original: { width: null, height: null }
      },
      defaultQuality: 80,
      highDPRQuality: 60, // Lower quality for high DPR to save bandwidth
      placeholderColor: '#2a2a2a',
      placeholderRatio: 0.5, // Maintain 1:2 ratio for thumbnails for consistency
      supportedFormats: ['webp', 'jpg', 'jpeg', 'png']
    };
    
    // Device capability detection
    const capabilities = {
      dpr: window.devicePixelRatio || 1,
      webp: false,
      avif: false,
      connection: 'unknown',
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    /**
     * Initialize module
     */
    function initialize() {
      // Detect device capabilities
      detectCapabilities()
        .then(() => {
          console.log('Device capabilities detected:', capabilities);
          // Process existing images
          processExistingImages();
        });
      
      // Set up event listeners
      setupEventListeners();
      
      return capabilities;
    }
    
    /**
     * Detect device capabilities for image optimization
     */
    async function detectCapabilities() {
      // Check WebP support
      capabilities.webp = await detectWebP();
      
      // Check AVIF support
      capabilities.avif = await detectAVIF();
      
      // Check network connection
      detectNetworkConnection();
      
      // Update viewport size
      updateViewportSize();
    }
    
    /**
     * Detect WebP support
     * @returns {Promise<boolean>} Whether WebP is supported
     */
    function detectWebP() {
      return new Promise(resolve => {
        const webP = new Image();
        webP.onload = function() {
          resolve(webP.height === 1);
        };
        webP.onerror = function() {
          resolve(false);
        };
        webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
      });
    }
    
    /**
     * Detect AVIF support
     * @returns {Promise<boolean>} Whether AVIF is supported
     */
    function detectAVIF() {
      return new Promise(resolve => {
        const avif = new Image();
        avif.onload = function() {
          resolve(avif.height === 1);
        };
        avif.onerror = function() {
          resolve(false);
        };
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      });
    }
    
    /**
     * Detect network connection type
     */
    function detectNetworkConnection() {
      // Use Network Information API if available
      if ('connection' in navigator) {
        capabilities.connection = navigator.connection.effectiveType || 'unknown';
        
        // Update when connection changes
        navigator.connection.addEventListener('change', () => {
          capabilities.connection = navigator.connection.effectiveType || 'unknown';
          console.log('Network connection changed:', capabilities.connection);
        });
      } else {
        // Fallback - make a conservative guess
        capabilities.connection = capabilities.dpr > 2 ? '4g' : '3g';
      }
    }
    
    /**
     * Update viewport size
     */
    function updateViewportSize() {
      capabilities.viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
      // Update viewport size on resize
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          updateViewportSize();
        }, 150);
      });
    }
    
    /**
     * Process existing images in the document
     */
    function processExistingImages() {
      // Find all grid images
      const gridImages = document.querySelectorAll('.grid-item img');
      
      gridImages.forEach(img => {
        prepareResponsiveImage(img);
      });
    }
    
    /**
     * Prepare an image for responsive loading
     * @param {HTMLImageElement} img - Image element to prepare
     */
    function prepareResponsiveImage(img) {
      // Skip already processed images
      if (img.hasAttribute('data-processed')) return;
      
      // Get original source
      const originalSrc = img.getAttribute('data-src') || img.src;
      if (!originalSrc) return;
      
      // Mark as processed
      img.setAttribute('data-processed', 'true');
      img.setAttribute('data-original-src', originalSrc);
      
      // For external images from i.ibb.co or other services
      if (originalSrc.startsWith('http') && (originalSrc.includes('i.ibb.co') || originalSrc.includes('imgur.com'))) {
        // Can't optimize external URLs, just use as is
        img.setAttribute('data-src', originalSrc);
      } else {
        // Local image that can be optimized
        optimizeImageSource(img, originalSrc);
      }
      
      // Add srcset if possible
      if (!originalSrc.startsWith('http')) {
        createSrcSet(img, originalSrc);
      }
      
      // Create and add placeholder
      addPlaceholder(img);
    }
    
    /**
     * Optimize image source based on device capabilities
     * @param {HTMLImageElement} img - Image element
     * @param {string} originalSrc - Original image source
     */
    function optimizeImageSource(img, originalSrc) {
      // Extract file extension
      const extension = getFileExtension(originalSrc);
      if (!extension) return;
      
      // Determine best format
      let format = extension;
      if (capabilities.webp) {
        format = 'webp';
      } else if (capabilities.avif) {
        format = 'avif';
      }
      
      // Determine appropriate size
      const size = determineImageSize();
      
      // Create optimized path
      // This assumes you have a server-side image processing capability
      // or a service like Cloudinary, Imgix, etc.
      
      // Example paths (would need to be adjusted based on your setup)
      let optimizedSrc = originalSrc;
      
      // For local image optimization, we'd typically use a service
      // In this implementation, we'll assume a hypothetical endpoint
      if (!originalSrc.startsWith('http')) {
        const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
        const quality = capabilities.dpr > 1.5 ? config.highDPRQuality : config.defaultQuality;
        
        optimizedSrc = `${basePath}-${size}q${quality}.${format}`;
      }
      
      // Set optimized source
      img.setAttribute('data-src', optimizedSrc);
    }
    
    /**
     * Create srcset attribute for responsive images
     * @param {HTMLImageElement} img - Image element
     * @param {string} originalSrc - Original image source
     */
    function createSrcSet(img, originalSrc) {
      // Skip external images
      if (originalSrc.startsWith('http')) return;
      
      // Get base path without extension
      const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
      
      // Determine best format
      const format = capabilities.webp ? 'webp' : 
                    capabilities.avif ? 'avif' : 
                    getFileExtension(originalSrc) || 'jpg';
      
      // Build srcset with multiple resolutions
      const srcset = [
        `${basePath}-400.${format} 400w`,
        `${basePath}-800.${format} 800w`,
        `${basePath}-1200.${format} 1200w`
      ].join(', ');
      
      // Set srcset attribute
      img.setAttribute('data-srcset', srcset);
      
      // Add sizes attribute
      img.setAttribute('sizes', '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw');
    }
    
    /**
     * Add placeholder for image
     * @param {HTMLImageElement} img - Image element
     */
    function addPlaceholder(img) {
      // Create a placeholder element
      const parent = img.closest('.grid-item');
      if (!parent) return;
      
      // Check if placeholder already exists
      if (parent.querySelector('.image-placeholder')) return;
      
      // Add placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder';
      parent.appendChild(placeholder);
      
      // Generate blurred placeholder
      generatePlaceholder(img, placeholder);
    }
    
    /**
     * Generate a placeholder for the image
     * @param {HTMLImageElement} img - Image element
     * @param {HTMLElement} placeholder - Placeholder element
     */
    function generatePlaceholder(img, placeholder) {
      // Determine original aspect ratio if possible
      let aspectRatio = config.placeholderRatio;
      
      // Try to get dimensions from original image
      const originalSrc = img.getAttribute('data-original-src');
      if (originalSrc) {
        // Try to extract dimensions from filename
        const dimensions = extractDimensionsFromFilename(originalSrc);
        if (dimensions && dimensions.width && dimensions.height) {
          aspectRatio = dimensions.height / dimensions.width;
        }
      }
      
      // Set placeholder style to maintain aspect ratio
      placeholder.style.paddingBottom = `${aspectRatio * 100}%`;
    }
    
    /**
     * Extract dimensions from filename if available
     * @param {string} filename - Image filename
     * @returns {Object|null} Dimensions object or null
     */
    function extractDimensionsFromFilename(filename) {
      // Try to extract dimensions from filename format like "image-800x600.jpg"
      const match = filename.match(/[-_](\d+)x(\d+)/);
      if (match && match.length === 3) {
        return {
          width: parseInt(match[1], 10),
          height: parseInt(match[2], 10)
        };
      }
      return null;
    }
    
    /**
     * Get file extension from path
     * @param {string} path - File path
     * @returns {string|null} File extension or null
     */
    function getFileExtension(path) {
      const match = path.match(/\.([^.\/?#]+)(?:[?#]|$)/);
      return match ? match[1].toLowerCase() : null;
    }
    
    /**
     * Determine appropriate image size based on device and connection
     * @returns {string} Size identifier
     */
    function determineImageSize() {
      // Start with medium as default
      let size = 'medium';
      
      // Adjust based on screen size
      if (capabilities.viewport.width <= 600) {
        size = 'thumbnail';
      } else if (capabilities.viewport.width > 1200 || capabilities.dpr > 1.5) {
        size = 'large';
      }
      
      // Downgrade for slow connections
      if (capabilities.connection === '2g' || capabilities.connection === 'slow-2g') {
        size = 'thumbnail';
      } else if (capabilities.connection === '3g' && size === 'large') {
        size = 'medium';
      }
      
      return size;
    }
    
    /**
     * Process a new image added to the DOM
     * @param {HTMLImageElement} img - New image element
     */
    function processNewImage(img) {
      // Skip if already processed
      if (img.hasAttribute('data-processed')) return;
      
      prepareResponsiveImage(img);
    }
    
    /**
     * Process a gallery of new images
     * @param {NodeList|Array} images - Collection of image elements
     */
    function processImageGallery(images) {
      if (!images || !images.length) return;
      
      Array.from(images).forEach(img => {
        processNewImage(img);
      });
    }
    
    /**
     * Check if image can be optimized
     * @param {string} src - Image source URL
     * @returns {boolean} Whether image can be optimized
     */
    function canOptimizeImage(src) {
      // External images can't be optimized
      if (src.startsWith('http') && !src.includes(window.location.hostname)) {
        return false;
      }
      
      // Check if file extension is supported
      const ext = getFileExtension(src);
      return ext && config.supportedFormats.includes(ext);
    }
    
    /**
     * Get optimized image URLs for different scenarios
     * @param {string} originalSrc - Original image source
     * @returns {Object} Object with optimized URLs
     */
    function getOptimizedUrls(originalSrc) {
      if (!canOptimizeImage(originalSrc)) {
        return {
          src: originalSrc,
          srcset: null,
          placeholder: null
        };
      }
      
      // Get base path without extension
      const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
      const ext = getFileExtension(originalSrc);
      
      // Determine best format
      const format = capabilities.webp ? 'webp' : 
                    capabilities.avif ? 'avif' : 
                    ext || 'jpg';
      
      // Set quality based on device
      const quality = capabilities.dpr > 1.5 ? config.highDPRQuality : config.defaultQuality;
      
      // Create URLs for different sizes
      const thumbnail = `${basePath}-400.${format}`;
      const medium = `${basePath}-800.${format}`;
      const large = `${basePath}-1200.${format}`;
      
      // Build srcset
      const srcset = [
        `${thumbnail} 400w`,
        `${medium} 800w`,
        `${large} 1200w`
      ].join(', ');
      
      // Determine appropriate source based on device
      const size = determineImageSize();
      const src = size === 'thumbnail' ? thumbnail : 
                 size === 'medium' ? medium : large;
      
      // Create placeholder URL
      const placeholder = `${basePath}-placeholder.${format}`;
      
      return {
        src,
        srcset,
        placeholder
      };
    }
    
    // Public API
    return {
      initialize,
      processNewImage,
      processImageGallery,
      getOptimizedUrls,
      getCapabilities: function() {
        return { ...capabilities };
      }
    };
  })();
  
  // Usage example
  // document.addEventListener('DOMContentLoaded', () => {
  //   ResponsiveImageHandler.initialize();
  // });
  