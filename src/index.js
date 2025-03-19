import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './Store/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom';
import { ProductsProvider } from './Store/ProductContext';
import { LoginBoxProvider } from './Store/LoginBoxContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProductsProvider>
        <LoginBoxProvider>
          <Router>
            <App />
          </Router>
        </LoginBoxProvider>
      </ProductsProvider>
    </AuthProvider>
  </React.StrictMode>
)