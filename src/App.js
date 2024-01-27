import './App.css';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home';
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Logout from './Pages/logout'
import Create from './Pages/Create'
import View from './Pages/ViewPost'
import { AuthContext, FirebaseContext } from './Store/ContextFiles'
import Post from './Store/productContext'

function App() {
  const { setUser } = useContext(AuthContext)
  const { Firebase } = useContext(FirebaseContext)
  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      setUser(user)
    })
  })

  return (
    <div>
      <Post>
        <Router>
          <Routes>
            <Route element={<Home />} path='/'></Route>
            <Route element={<Signup />} path='/signup'></Route>
            <Route element={<Login />} path='/login'></Route>
            <Route element={<Logout />} path='/logout'></Route>
            <Route element={<Create />} path='/create'></Route>
            <Route element={<View />} path='/view'></Route>
          </Routes>
        </Router>
      </Post>
    </div>
  )
}

export default App;
