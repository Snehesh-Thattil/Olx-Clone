import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './Store/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom';
import { ProductsProvider } from './Store/ProductContext';
import { LoginBoxProvider } from './Store/LoginBoxContext';
import { SearchProvider } from './Store/SearchContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SearchProvider>
        <ProductsProvider>
          <LoginBoxProvider>
            <Router>
              <App />
              <Toaster/>
            </Router>
          </LoginBoxProvider>
        </ProductsProvider>
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
)