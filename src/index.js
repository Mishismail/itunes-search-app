import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './index.css'; // Import your CSS styling here
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = document.getElementById('root');

// Use createRoot to render your app
const reactRoot = createRoot(root);

reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();




