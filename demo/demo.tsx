import React from 'react';
import ReactDOM from 'react-dom/client';
import AnnotationDraw from './Example';
import './demo.css';

ReactDOM.createRoot(document.getElementById('demo-root')!).render(
  <React.StrictMode>
    <AnnotationDraw />
  </React.StrictMode>,
);
