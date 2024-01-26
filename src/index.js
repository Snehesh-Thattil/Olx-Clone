import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Context, { FirebaseContext } from './Store/FirebaseContext'
import Firebase from './Firebase/config';

ReactDOM.render(
    <FirebaseContext.Provider value={{ Firebase }}>
        <Context>
            <App />
        </Context>
    </FirebaseContext.Provider>
    , document.getElementById('root'))
