import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const dom = document.getElementById('root');

if (dom) {
  ReactDOM.createRoot(dom).render(
    import.meta.env.MODE === 'development' ? (
      <App />
    ) : (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  );
}
