/**
 * Font Loader
 * Handles loading and fallback for custom fonts
 */

// Font files to preload
const fontFiles = [
    '/assets/fonts/VT323-Regular.woff2',
    '/assets/fonts/PressStart2P-Regular.woff2'
];

/**
 * Check if fonts are available and apply appropriate classes
 */
export const initFonts = () => {
    // Add loading class initially
    document.documentElement.classList.add('font-loading');
    
    // Check if fonts are already cached
    if (sessionStorage.getItem('fontsLoaded')) {
        document.documentElement.classList.remove('font-loading');
        return;
    }
    
    // Use FontFaceObserver if available, otherwise use a simple timeout
    setTimeout(() => {
        document.documentElement.classList.remove('font-loading');
        sessionStorage.setItem('fontsLoaded', 'true');
    }, 2000);
    
    // Preload font files
    fontFiles.forEach(fontUrl => {
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
};
