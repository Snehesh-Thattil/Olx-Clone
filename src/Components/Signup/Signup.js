import React, { useState } from 'react';
import Logo from '../../Assets/Images/olx-logo.png';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firbase-config';
import Loader from '../Loader/Loader'

export default function Signup() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [load, setLoad] = useState(false)
  const navigate = useNavigate()

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
            phone: userData.phone
          })
        })
        .then(() => {
          setLoad(false)
          navigate('/')
        })
        .catch((err) => {
          setLoad(false)
          alert(err.message)
        })
    }
  }

  // Rendering
  if (load) return <Loader />
  return (
    <div className="signupParentDiv">
      <img width="500px" height="150px" src={Logo} alt='Err'></img>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
          name="name"
        />

        <input
          type="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          name="email"
        />

        <input
          type="number"
          value={userData.phone}
          onChange={handleChange}
          placeholder="Mobile number"
          name="phone"
        />

        <input
          type="password"
          value={userData.password}
          onChange={handleChange}
          password="Password"
          name="password"
        />

        <input
          type="password"
          value={userData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          name="confirmPassword"
        />

        <button>Signup</button>
      </form>

      <Link to='/login'>Already have an account?</Link>
    </div>
  )
}