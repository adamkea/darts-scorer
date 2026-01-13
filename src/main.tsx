import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize theme before React renders to prevent flash
(function() {
  const stored = localStorage.getItem('theme');
  const isDark = stored 
    ? stored === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
