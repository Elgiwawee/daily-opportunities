
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import i18n configuration (App.tsx already imports it, but adding it here for clarity)
import './i18n'

createRoot(document.getElementById("root")!).render(<App />);
