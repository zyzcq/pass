import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 确保引入了 Tailwind 的样式文件

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);