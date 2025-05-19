
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import i18n configuration before rendering the app
import './i18n'

createRoot(document.getElementById("root")!).render(<App />);
