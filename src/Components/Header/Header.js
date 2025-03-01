import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './Header.css';
import OlxLogo from '../../Assets/OlxLogo';
import Search from '../../Assets/Search';
import Arrow from '../../Assets/Arrow';
import SellButton from '../../Assets/SellButton';
import SellButtonPlus from '../../Assets/SellButtonPlus';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/firbase-config';
import Login from '../Login/Login';
import SignUp from '../Signup/SignUp';
import { AuthContext } from '../../Store/ContextFiles';

function Header() {
  const [loginBox, setLoginBox] = useState(null)
  const [language, setLanguage] = useState('English')
  const { user } = useContext(AuthContext)
  const languageRef = useRef()
  const notificationsRef = useRef()
  const profileRef = useRef()
  const navigate = useNavigate()

  // Sell button click
  const handleVerifyUser = (path) => {
    if (user) {
      navigate(path)
    } else {
      setLoginBox('Login')
    }
  }

  // Signing out user
  const handleSignOut = useCallback(() => {
    signOut(auth)
      .then(() => {
        alert('signed out successfully')
        window.location.reload()
      })
      .catch((err) => console.log("Error signing out:", err.message))
  }, [])

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

  // JSX
  return (
    <div className="headerParentDiv">
      {loginBox === 'Login' && <Login setLoginBox={setLoginBox} />}
      {loginBox === 'Sign-up' && <SignUp setLoginBox={setLoginBox} />}

      <div className="headerChildDiv">
        <div onClick={() => navigate('/')} className="brandName">
          <OlxLogo></OlxLogo>
        </div>

        <div className="searchbars">
          <div className="placeSearch">
            <Search></Search>
            <input type="text" />
            <Arrow></Arrow>
          </div>

          <div className="productSearch">
            <div className="input">
              <input
                type="text"
                placeholder="Find car,mobile phone and more..."
              />
            </div>

            <div className="searchAction">
              <Search color="#ffffff"></Search>
            </div>
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

          <i className="fa-regular fa-heart" onClick={() => handleVerifyUser('/wishlist')}></i>
          <i className="fa-regular fa-comment-dots" onClick={() => handleVerifyUser('/chats')}></i>

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
                <h3>{user.displayName.slice(0, 1)}</h3>
                <i className="fa-solid fa-angle-down"></i>
              </div> :
              <span className='link' onClick={() => setLoginBox('Sign-up')}>Sign Up</span>}

            {user && <div className="options" >
              <div className="view-profile">
                <div className="info">
                  <h1>{user.displayName.slice(0, 1)}</h1>
                  <h2>{user.displayName}</h2>
                </div>
                <button>View and edit profile</button>
              </div>
              <li><i className="fa-solid fa-address-card"></i>My ADS</li>
              <li><i className="fa-solid fa-file-contract"></i>Buy Business Package</li>
              <li><i className="fa-regular fa-credit-card"></i>Bought Packages & Billing</li>
              <li><i className="fa-solid fa-question"></i>Help</li>
              <li><i className="fa-solid fa-gear"></i>Settings</li>
              <li><i className="fa-solid fa-download"></i>Install OLX Lite app</li>
              <li onClick={() => handleSignOut()}><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</li>
              <div className="pointer" ></div>
            </div>}
          </div>

          <div className="sellMenu" onClick={() => handleVerifyUser('/create')}>
            <SellButton></SellButton>
            <div className="sellMenuContent">
              <SellButtonPlus></SellButtonPlus>
              <span>SELL</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Header;
