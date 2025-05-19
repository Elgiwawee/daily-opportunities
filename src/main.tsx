
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set up i18n before importing App
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

// Make sure the DOM is ready before rendering
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
}
