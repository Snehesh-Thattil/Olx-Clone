import React, { useContext, useEffect, useRef, useState } from 'react';
import './Header.css';
import OlxLogo from '../../Assets/OlxLogo';
import Search from '../../Assets/Search';
import SellBotton from '../../Assets/Images/Sell-Button.png'
import { useNavigate } from 'react-router-dom';
import SignUp from '../Signup/SignUp';
import SignIn from '../Signup/SignIn';
import { AuthContext } from '../../Store/AuthContext';
import ProfileOptions from '../ProfileOptions/ProfileOptions';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../Firebase/firbase-config';

function Header({ search, setSearch }) {
  const [loginBox, setLoginBox] = useState(null)
  const [language, setLanguage] = useState('English')
  const [locationOpts, setLocationOpts] = useState(false)
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()

  const languageRef = useRef()
  const notificationsRef = useRef()
  const profileRef = useRef()
  const mobileNavRef = useRef()
  const placeInputRef = useRef()
  const productInputRef = useRef()

  // Verify user before proceeding certain clicks
  const handleVerifyUser = (path) => {
    user ? navigate(path) : setLoginBox('Login')
  }

  // Handle Collapse both dropdowns
  useEffect(() => {
    const handleDropdown = (e) => {
      if (!languageRef.current?.contains(e.target)) {
        languageRef.current?.classList.remove('active')
      }
      if (!notificationsRef.current?.contains(e.target)) {
        notificationsRef.current?.classList.remove('active')
      }
      if (!profileRef.current?.contains(e.target)) {
        profileRef.current?.classList.remove('active')
      }
    }
    document.addEventListener('mousedown', handleDropdown)
    document.addEventListener('scroll', handleDropdown)
    return () => {
      document.removeEventListener('mousedown', handleDropdown)
      document.addEventListener('scroll', handleDropdown)
    }
  }, [])

  // Collapse mobile header on scroll-down
  useEffect(() => {
    let lastScroll = window.scrollY
    const handleScrolldown = () => {
      const currentScroll = window.scrollY
      mobileNavRef.current?.classList.toggle('fixed', lastScroll > currentScroll)
      lastScroll = currentScroll
    }
    document.addEventListener('scroll', handleScrolldown)
    return () => document.removeEventListener('scroll', handleScrolldown)
  }, [])

  // Helper functions to update recent searches on firebase
  const updateSearchLog = async (place, product) => {
    try {
      const q = query(collection(db, 'users'), where('id', '==', user?.uid))
      const userDocSnap = await getDocs(q)

      const userDocRef = userDocSnap.docs[0].ref
      const recentPlaceSearches = userDocSnap.docs[0].data().recentPlaceSearches || []
      const recentProductSearches = userDocSnap.docs[0].data().recentProductSearches || []

      if (!recentPlaceSearches.some((item) => item.toLowerCase().trim() === place.toLowerCase().trim())) {
        const updatedPlaces = [place, ...recentPlaceSearches].slice(0, 5)
        await updateDoc(userDocRef, { recentPlaceSearches: updatedPlaces })
      }

      if (!recentProductSearches.some((item) => item.toLowerCase().trim() === product.toLowerCase().trim())) {
        const updatedProducts = [product, ...recentProductSearches].slice(0, 5)
        await updateDoc(userDocRef, { recentProductSearches: updatedProducts })
      }
    }
    catch (err) {
      console.error("Error updating recent search data :", err.message)
    }
  }

  // Search button click after place & product input
  const handleSearchBtnClick = async () => {
    const place = placeInputRef.current?.value || `${user?.district}, ${user?.state}`
    const product = productInputRef.current?.value || ''

    setSearch(prev => ({ ...prev, place, product }))
    await updateSearchLog(place, product)
  }

  // Handle location select by options
  function handleLocSelect(search) {
    if (search === 'current-loc') {
      placeInputRef.current.value = `${user?.district}, ${user?.state}`
    } else {
      placeInputRef.current.value = search
    }
  }

  // JSX
  if (loginBox === "Sign-in") return <SignIn setLoginBox={setLoginBox} />
  if (loginBox === "Sign-up") return <SignUp setLoginBox={setLoginBox} />
  return (
    <div className="Header" ref={mobileNavRef}>
      <ProfileOptions mobile setLoginBox={setLoginBox} />

      <div className="logo">
        <i className="fa-solid fa-bars" onClick={() => mobileNavRef.current.classList.toggle('active')}></i>
        <div onClick={() => navigate('/')} className="brandName">
          <OlxLogo></OlxLogo>
        </div>
      </div>

      <div className="placeSearch">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text"
          placeholder='Search place here ...'
          defaultValue={search?.place}
          onFocus={() => setLocationOpts(true)}
          onBlur={() => setTimeout(() => setLocationOpts(false), 200)}
          ref={placeInputRef}
        />

        <i className={locationOpts ? "fa-solid fa-angle-up transform" : "fa-solid fa-angle-up"}></i>

        {locationOpts && <div className="place-options">
          <div className='curr-loc-div' onClick={() => handleLocSelect('current-loc')}>
            <i className="fa-regular fa-circle-dot"></i>
            <div className="curr-loc">
              <h4>Use your current location </h4>
              <p>{user?.neighbourhood}, {user?.district}, {user?.state}</p>
            </div>
          </div>

          <div className="recent-loc-div">
            <p>Recent</p>
            {user?.recentPlaceSearches?.slice(0, 4).map((search, index) => (
              <li key={index} onClick={() => handleLocSelect(search)}>{search}</li>
            ))}
          </div>

          <div className="popular-loc-div">
            <p>Poplular</p>
            {['Bangalore', 'Tamil Nadu', 'Mumbai', 'Kerala'].map((place, index) => (
              <li key={index} onClick={() => handleLocSelect(place)}>{place}</li>
            ))}
          </div>
        </div>}
      </div>

      <div className="productSearch">
        <div className="input">
          <input type="text"
            placeholder="Find car,mobile phone and more..."
            ref={productInputRef}
          />
        </div>
        <div className="searchAction" onClick={handleSearchBtnClick}>
          <Search color="#ffffff"></Search>
        </div>
      </div>

      <div className="right-section">

        <div className="language" ref={languageRef} onClick={() => languageRef.current.classList.toggle('active')}>
          <span> {language} </span>
          <i className="fa-solid fa-angle-down"></i>
          <div className="options" >
            <li onClick={() => setLanguage('English')}>English</li>
            <li onClick={() => setLanguage('Hindi')}>Hindi</li>
            <li onClick={() => setLanguage('Malayalam')}>Malayalam</li>
            <div className="pointer"></div>
          </div>
        </div>

        <i className="fa-regular fa-heart" tabIndex="0" onClick={() => handleVerifyUser('/wishlist')}></i>
        <i className="fa-regular fa-comment-dots" tabIndex="0" onClick={() => handleVerifyUser('/chats')}></i>

        <div className="notifications" ref={notificationsRef} onClick={() => notificationsRef.current.classList.toggle('active')}>
          <i className="fa-regular fa-bell"></i>
          <div className="messgs" >
            <li>dummy1</li>
            <li>dummy2</li>
            <li>dummy2</li>
            <li>dummy4</li>
            <li>dummy5</li>
            <div className="pointer"></div>
          </div>
        </div>

        <div className="loginPage" ref={profileRef} onClick={() => user && profileRef.current?.classList.toggle('active')}>
          {user ?
            <div className='profile-box'>
              <h3>{user?.displayName?.charAt(0)}</h3>
              <i className="fa-solid fa-angle-down"></i>
            </div> :
            <span className='link' onClick={() => setLoginBox('Sign-up')}>Sign Up</span>}

          {user && <ProfileOptions />}
        </div>

        <div className="sellButton" onClick={() => handleVerifyUser('/post-ads-list')}>
          <img src={SellBotton} alt="" />
        </div>

      </div>

    </div>
  )
}

export default Header;