import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './Store/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom';
import { ProductsProvider } from './Store/productContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProductsProvider>
        <Router>
          <App />
        </Router>
      </ProductsProvider>
    </AuthProvider>
  </React.StrictMode>
)