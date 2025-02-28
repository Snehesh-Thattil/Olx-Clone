import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextWrapper, FirebaseContext } from './Store/ContextFiles'
import { app } from './Firebase/firbase-config';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={{ app }}>
      <AuthContextWrapper>
        <Router>
          <App />
        </Router>
      </AuthContextWrapper>
    </FirebaseContext.Provider>
  </React.StrictMode>
)