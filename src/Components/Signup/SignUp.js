import React, { useRef, useState, useEffect } from 'react';
import Logo from '../../Assets/Images/olx-logo.png';
import './SignUp.css';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firbase-config';
import Loader from '../Loader/Loader'

function SignUp({ setLoginBox }) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [load, setLoad] = useState(false)
  const signUpRef = useRef()

  // Close login popUp when clicking outside
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!signUpRef?.current.contains(e.target)) {
        setLoginBox(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [setLoginBox])

  // Handle change input values
  function handleChange(e) {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  // Submition of sign-up form
  function handleSubmit(e) {
    e.preventDefault()
    setLoad(true)
    const userCollectionRef = collection(db, 'user')

    const regexInputs = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/
    }

    if (!regexInputs.email.test(userData.email)) {
      setLoad(false)
      alert("Oops, invalid email")
    }
    else if (userData.confirmPassword !== userData.password) {
      setLoad(false)
      alert("Oops, passwords don't match")
    }
    else if (!regexInputs.password.test(userData.password)) {
      setLoad(false)
      alert("Hey there, password must contain one uppercase letter, one lowercase letter, and one special character")
    }
    else {
      createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then((res) => {
          sendEmailVerification(res.user)
            .then(() => {
              alert('Hey there, check the verification mail in your inbox for Login')
            }).catch((err) => alert(err.message))
          return res
        })
        .then((res) => {
          updateProfile(res.user, { displayName: userData.name })
          return res
        })
        .then((res) => {
          addDoc(userCollectionRef, {
            id: res.user.uid,
            username: userData.name,
            email: userData.email
          })
        })
        .then(() => {
          setLoad(false)
          setLoginBox('Login')
        })
        .catch((err) => {
          setLoad(false)
          setLoginBox('Login')
          alert(err.message)
        })
    }
  }

  // Rendering
  if (load) return <Loader />
  return (
    <div className="SignUp">
      <div className="signUp-box" ref={signUpRef}>

        <img src={Logo} alt='Err'></img>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userData.name}
            onChange={handleChange}
            placeholder="Name"
            name="name"
            required
          />

          <input
            type="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
            name="email"
            required
          />

          <input
            type="password"
            value={userData.password}
            onChange={handleChange}
            name="password"
            placeholder="Password"
            required
          />

          <input
            type="password"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            name="confirmPassword"
            required
          />

          <button>Signup</button>
        </form>

        <p>Already have an account?<span onClick={() => setLoginBox('Login')}>Login</span></p>

        <div className="bottom-side">
          <h5>All your personal details are safe with us.</h5>
          <p>If you continue, you are accepting our <a href="https://help.olx.in/hc/en-us">Terms and Conditions and Privacy Policy</a></p>
        </div>

      </div>
    </div>
  )
}

export default SignUp