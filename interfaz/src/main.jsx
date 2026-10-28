import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Punto de entrada de React: monta el componente principal dentro del elemento #root.

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
