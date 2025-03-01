import React, { useState, useEffect, useRef } from 'react';
import Logo from '../../Assets/Images/olx-logo.png';
import './Login.css';
import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase/firbase-config';
import Loader from '../Loader/Loader';

function Login({ setLoginBox }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [load, setLoad] = useState(false)
  const loginboxRef = useRef()

  // Submition of Login details
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoad(true)

    signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        const user = res.user
        await user.reload()
        await user.getIdToken(true)

        if (!user.emailVerified) {
          sendEmailVerification(res.user)
          setLoad(false)
          alert("Please verify your email before logging in.")
        }
        setLoad(false)
        setLoginBox(null)
      })
      .catch((err) => {
        setLoad(false)
        alert(err.message)
      })
  }

  // Close login popUp when clicking outside
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!loginboxRef?.current.contains(e.target)) {
        setLoginBox(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [setLoginBox])

  // JSX
  if (load) return <Loader />
  return (
    <div className='Login'>
      <div className="login-box" ref={loginboxRef}>
        <img src={Logo} alt='Err'></img>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            name="email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            name="password"
          />

          <button>Login</button>
        </form>

        <p className='link'>New to OLX? <span onClick={() => setLoginBox('Sign-up')}>SignUp</span></p>

        <div className="bottom-side">
          <h5>All your personal details are safe with us.</h5>
          <p>If you continue, you are accepting our <a href="https://help.olx.in/hc/en-us">Terms and Conditions and Privacy Policy</a></p>
        </div>

      </div>
    </div>
  )
}

export default Login;
