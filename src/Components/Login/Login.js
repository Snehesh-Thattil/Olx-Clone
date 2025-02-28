import React, { useState, useContext } from 'react';
import Logo from '../../Assets/Images/olx-logo.png';
import { useNavigate } from 'react-router-dom'
import './Login.css';
import { FirebaseContext } from '../../Store/ContextFiles';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const { app } = useContext(FirebaseContext)
  const [Email, setEmail] = useState('')
  const [Passowrd, setPassword] = useState('')
  const navigate = useNavigate()

  const auth = getAuth(app)

  const handleSubmit = (e) => {
    e.preventDefault()

    signInWithEmailAndPassword(auth, Email, Passowrd)
      .then(() => {
        alert('Logged-In')
      })
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        alert(error.message)
        console.log(error.message)
      })
  }

  return (
    <div>
      <div className="loginParentDiv">
        <img src={Logo} alt='Err'></img>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            name="email"
          />

          <input
            type="password"
            value={Passowrd}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            name="password"
          />

          <button>Login</button>
        </form>

        <a href='/signup'>New to OLX ?</a>
      </div>
    </div>
  )
}

export default Login;
