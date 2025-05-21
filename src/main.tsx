import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import i18n configuration (App.tsx already imports it, but adding it here for clarity)
import './i18n'

// Register service worker for push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
      
    // Register the permissions check service worker
    navigator.serviceWorker.register('/sw-check-permissions-79aec.js')
      .then(registration => {
        console.log('Permissions check Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Permissions check Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
