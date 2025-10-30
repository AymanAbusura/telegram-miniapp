import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const subid = new URLSearchParams(window.location.search).get("subid");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App subid={subid} />
  </React.StrictMode>
);
