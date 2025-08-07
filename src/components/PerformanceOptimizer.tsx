import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontPreload = document.createElement('link');
      fontPreload.rel = 'preload';
      fontPreload.as = 'font';
      fontPreload.type = 'font/woff2';
      fontPreload.crossOrigin = 'anonymous';
      document.head.appendChild(fontPreload);

      // Preconnect to external domains
      const googleFonts = document.createElement('link');
      googleFonts.rel = 'preconnect';
      googleFonts.href = 'https://fonts.googleapis.com';
      document.head.appendChild(googleFonts);

      const googleFontsStatic = document.createElement('link');
      googleFontsStatic.rel = 'preconnect';
      googleFontsStatic.href = 'https://fonts.gstatic.com';
      googleFontsStatic.crossOrigin = 'anonymous';
      document.head.appendChild(googleFontsStatic);

      // Preconnect to Supabase
      const supabasePreconnect = document.createElement('link');
      supabasePreconnect.rel = 'preconnect';
      supabasePreconnect.href = 'https://mkcvqqaumfwyrkurfohh.supabase.co';
      document.head.appendChild(supabasePreconnect);
    };

    // Optimize images with loading="lazy" and proper sizing
    const optimizeImages = () => {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach((img) => {
        (img as HTMLImageElement).loading = 'lazy';
      });
    };

    // Defer non-critical scripts
    const deferNonCriticalScripts = () => {
      const scripts = document.querySelectorAll('script:not([defer]):not([async])');
      scripts.forEach((script) => {
        const scriptElement = script as HTMLScriptElement;
        if (scriptElement.src && !scriptElement.src.includes('vital') && !scriptElement.src.includes('critical')) {
          scriptElement.setAttribute('defer', '');
        }
      });
    };

    // Initialize performance optimizations
    preloadCriticalResources();
    optimizeImages();
    deferNonCriticalScripts();

    // Web Vitals monitoring (simplified - no external dependency)
    const reportWebVitals = () => {
      // Basic performance monitoring without external library
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart);
      }
    };

    // Report after page load
    setTimeout(reportWebVitals, 1000);
  }, []);

  return null;
};

export default PerformanceOptimizer;