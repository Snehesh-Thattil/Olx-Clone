import React, { useContext, useEffect } from 'react'
import './App.css'
import Home from './Pages/Home'
import Listing from './Pages/Listing'
import PostAd from './Pages/PostAd'
import ViewPost from './Pages/ViewPost'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AuthContext } from './Store/AuthContext'
import { onIdTokenChanged } from 'firebase/auth'
import axios from "axios"
import MyAds from './Pages/MyAdListings'
import { ProductsContext } from './Store/productContext'
import { auth, db } from './Firebase/firbase-config'
import { collection, getDocs, query, where } from 'firebase/firestore'

function App() {
  const { user, setUser } = useContext(AuthContext)
  const { setProducts } = useContext(ProductsContext)
  const { pathname } = useLocation()
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  // Fetch all products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'))
        setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      } catch (err) {
        console.error("Error fetching products:", err.message)
      }
    }

    fetchProducts()
  }, [setProducts])

  // Fetch user's location using navigator
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Oops! OLX can't access your location")
      return
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`)

        if (!data.results.length) return

        const addressComponents = data.results[0].address_components
        const formattedAddress = data.results[0].formatted_address
        const state = addressComponents.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name
        const district = addressComponents.find(comp => comp.types.includes("administrative_area_level_3"))?.long_name
        const neighbourhood = addressComponents.find(comp => comp.types.some(type => ["sublocality", "neighborhood", "locality"].includes(type)))?.long_name

        setUser(prev => ({
          ...prev,
          formattedAddress,
          state,
          district,
          neighbourhood,
          coords: { latitude, longitude }
        }))
      } catch (err) {
        console.error('Error fetching location:', err.message)
      }
    })
  }, [GOOGLE_API_KEY, setUser])

  // Fetch users recent searches from firebase
  useEffect(() => {
    if (!user?.uid) return

    const fetchRecentSearches = async () => {
      try {
        const q = query(collection(db, 'users'), where('id', '==', user.uid))
        const userDocSnap = await getDocs(q)

        if (!userDocSnap.empty) {
          const userData = userDocSnap.docs[0].data()

          setUser(prev => ({
            ...prev,
            recentPlaceSearches: userData.recentPlaceSearches || [],
            recentProductSearches: userData.recentProductSearches || [],
          }))
        }
      } catch (err) {
        console.error("Error fetching recent searches:", err.message)
      }
    }

    fetchRecentSearches()
  }, [user?.uid, setUser])

  // Check user sign-in status
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (userAuth) => {
      if (userAuth?.emailVerified) {
        setUser((prev) => ({ ...prev, ...userAuth }))
        console.log('User logged in :', userAuth.displayName, '|', userAuth.email)
      } else {
        setUser(null)
        console.log("Unverified email")
      }
    })

    return () => unsubscribe()
  }, [setUser])

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="App">
      {!user ?
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<ViewPost />} path='/view' />
        </Routes>
        :
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<ViewPost />} path='/view' />
          <Route element={<PostAd />} path='/post-ads-list' />
          <Route element={<Listing />} path='/listing-form' />
          <Route element={<MyAds />} path='/my-ads' />
        </Routes>
      }
    </div>
  )
}

export default App;