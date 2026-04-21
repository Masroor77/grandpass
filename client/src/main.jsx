import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// If something crashes before React can show anything,
// render a minimal error message so the screen isn't blank.
window.addEventListener('error', (e) => {
  const root = document.getElementById('root');
  if (!root) return;
  if (root.childElementCount > 0) return;
  root.innerHTML = `
    <div style="font-family: system-ui, sans-serif; padding: 16px;">
      <h2 style="margin:0 0 8px 0;">App crashed while loading</h2>
      <div style="color:#b91c1c; white-space:pre-wrap;">${String(e?.error?.message || e?.message || e)}</div>
      <div style="margin-top:10px; color:#475569;">Open DevTools → Console for details.</div>
    </div>
  `;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
