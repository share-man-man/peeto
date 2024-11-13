import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const dom = document.getElementById('root');

const isStrict = import.meta.env.VITE_DEMO_MODE === 'strict';

if (dom) {
  ReactDOM.createRoot(dom).render(
    isStrict ? (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) : (
      <App />
    )
  );
}
