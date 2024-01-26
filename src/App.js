import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home';
import Signup from './Pages/Signup'
import Login from './Pages/Login'

function App() {
  return (
    <div>
      <Router>
        <Routes>

          <Route element={<Home />} path='/'></Route>
          <Route element={<Signup />} path='/signup'></Route>
          <Route element={<Login />} path='/login'></Route>

        </Routes>
      </Router>
    </div>
  )
}

export default App;
