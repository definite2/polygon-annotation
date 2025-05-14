import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './demo.css';
import ImageExample from './ImageExample';
import LineDrawExample from './LineDrawExample';
import VideoExample from './VideoExample';

ReactDOM.createRoot(document.getElementById('demo-root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/video" style={{ marginRight: 10 }}>
          Video Example
        </Link>
        <Link to="/image" style={{ marginRight: 10 }}>
          Image Example
        </Link>
        <Link to="/line">Line Draw Example</Link>
      </nav>

      <div className="App">
        <Routes>
          <Route path="/video" element={<VideoExample />} />
          <Route path="/image" element={<ImageExample />} />
          <Route path="/line" element={<LineDrawExample />} />
          <Route path="*" element={<VideoExample />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
);
