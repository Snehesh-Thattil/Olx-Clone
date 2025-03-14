import React, { useCallback, useContext, useEffect } from 'react'
import './App.css'
import Home from './Pages/Home'
import Listing from './Pages/Listing'
import PostAd from './Pages/PostAd'
import ViewPost from './Pages/ViewPost'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AuthContext } from './Store/AuthContext'
import { onIdTokenChanged } from 'firebase/auth'
import { auth, db } from './Firebase/firbase-config'
import axios from "axios"
import MyAds from './Pages/MyAdListings'
import { ProductsContext } from './Store/productContext'
import { collection, getDocs } from 'firebase/firestore'

function App() {
  const { user, setUser } = useContext(AuthContext)
  const { setProducts } = useContext(ProductsContext)
  const { pathname } = useLocation()
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  // Fetching all products from Firebase
  const fetchProducts = useCallback(async () => {
    const productsCollRef = collection(db, 'products')

    try {
      const snapshot = await getDocs(productsCollRef)
      const allProducts = snapshot.docs.map((product) => {
        return {
          ...product.data(),
          id: product.id
        }
      })
      setProducts(allProducts)
    }
    catch (err) {
      console.error("Error fetching products", err.message)
    }
  }, [setProducts])

  // Fetch users location and store it
  const fetchLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords

          const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`)
          const addressComponents = data.results[0].address_components
          const formattedAddress = data.results[0].formatted_address

          const state = await addressComponents?.find((comp) => comp.types.includes("administrative_area_level_1"))?.long_name
          const district = await addressComponents?.find((comp) => comp.types.includes("administrative_area_level_3"))?.long_name
          const neighbourhood = await addressComponents?.find((comp) => comp.types.includes("sublocality") || comp.types.includes("neighborhood") || comp.types.includes("locality"))?.long_name

          setUser((prev) => ({
            ...prev,
            formattedAddress,
            state: state,
            district: district,
            neighbourhood: neighbourhood,
            coords: { latitude, longitude }
          }))
        }
        catch (err) {
          console.error('Error fetching location:', err.message);
        }
      })
    }
    else {
      alert("oops! OLX Cant access your location")
    }
  }, [GOOGLE_API_KEY, setUser])

  // Fetch products, users location and scroll top on page change
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchProducts()
    fetchLocation()
  }, [pathname, fetchProducts, fetchLocation])

  // Checking user sign-in status
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (userAuth) => {
      if (userAuth?.emailVerified) {
        setUser(userAuth)
        console.log('User logged in :', userAuth.displayName, '|', userAuth.email)
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