import React, { useContext, useEffect } from 'react'
import './App.css'
import Home from './Pages/Home'
import Listing from './Pages/Listing'
import PostAd from './Pages/PostAd'
import View from './Pages/ViewPost'
import { Route, Routes } from 'react-router-dom'
import { AuthContext } from './Store/AuthContext'
import { onIdTokenChanged } from 'firebase/auth'
import { auth } from './Firebase/firbase-config'

function App() {
  const { user, setUser } = useContext(AuthContext)

  // Checking user sign-in status
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (userAuth) => {
      if (userAuth?.emailVerified) {
        console.log('User logged in :', userAuth.displayName, '|', userAuth.email)
        setUser(userAuth)
      } else {
        setUser(null)
        console.log("Unverified email")
      }
    })

    return () => unsubscribe()
  }, [setUser])

  return (
    <div className="App">
      {!user ?
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<View />} path='/view' />
        </Routes>
        :
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<View />} path='/view' />
          <Route element={<PostAd />} path='/create' />
          <Route element={<Listing />} path='/listing-form' />
        </Routes>
      }
    </div>
  )
}

export default App;