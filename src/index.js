import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextWrapper } from './Store/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom';
import { PostContextWrapper } from './Store/productContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextWrapper>
      <PostContextWrapper>
        <Router>
          <App />
        </Router>
      </PostContextWrapper>
    </AuthContextWrapper>
  </React.StrictMode>
)