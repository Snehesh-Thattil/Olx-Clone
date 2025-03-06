import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextWrapper } from './Store/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextWrapper>
      <Router>
        <App />
      </Router>
    </AuthContextWrapper>
  </React.StrictMode>
)