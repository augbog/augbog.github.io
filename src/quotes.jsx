import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import Quotes from './pages/Quotes';

createRoot(document.getElementById('quotes-root')).render(
  <StrictMode>
    <Quotes />
  </StrictMode>
);
