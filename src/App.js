import React, { useContext, useEffect } from 'react'
import './App.css'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Create from './Pages/Create'
import View from './Pages/ViewPost'
import Post from './Store/productContext'
import { Route, Routes } from 'react-router-dom'
import { AuthContext, FirebaseContext } from './Store/ContextFiles'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function App() {
  const { setUser } = useContext(AuthContext)
  const { app } = useContext(FirebaseContext)
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        console.log("User logged in:", user.displayName || user.uid)
      } else {
        setUser(null)
        console.log("No user is logged in")
      }
    })
    return () => unsubscribe()
  }, [setUser, auth])

  return (
    <div className="App">
      <Post>
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<Signup />} path='/signup' />
          <Route element={<Login />} path='/login' />
          <Route element={<Create />} path='/create' />
          <Route element={<View />} path='/view' />
        </Routes>
      </Post>
    </div>
  )
}

export default App;
