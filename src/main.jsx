import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './contexts/theme.jsx';
import App from './app.jsx';
import '@unocss/reset/tailwind.css';
// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ThemeProvider>
    <App />
  </ThemeProvider>
  // </React.StrictMode>
);
