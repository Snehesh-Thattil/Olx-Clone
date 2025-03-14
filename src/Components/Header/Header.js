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

function Header() {
  const [loginBox, setLoginBox] = useState(null)
  const [language, setLanguage] = useState('English')
  const { user } = useContext(AuthContext)
  const languageRef = useRef()
  const notificationsRef = useRef()
  const profileRef = useRef()
  const mobileNavRef = useRef()
  const navigate = useNavigate()

  // Verify user before proceeding certain clicks
  const handleVerifyUser = (path) => {
    if (user) {
      navigate(path)
    } else {
      setLoginBox('Login')
    }
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
      if (lastScroll > currentScroll) {
        mobileNavRef.current?.classList.add('fixed')
      } else {
        mobileNavRef.current?.classList.remove('fixed')
      }
      lastScroll = currentScroll
    }
    document.addEventListener('scroll', handleScrolldown)
    return () => document.removeEventListener('scroll', handleScrolldown)
  }, [])

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
        <input type="text" />
        <i className="fa-solid fa-angle-down"></i>
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
              <h3>{user.displayName?.slice(0, 1)}</h3>
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