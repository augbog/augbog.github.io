import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';

// GitHub Pages SPA redirect: pick up the ?p= param from 404.html
(function () {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('p');
  if (redirect) {
    window.history.replaceState(null, '', redirect);
  }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
