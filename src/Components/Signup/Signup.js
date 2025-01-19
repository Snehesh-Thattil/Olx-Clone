import React, { useState, useContext } from 'react';
import Logo from '../../olx-logo.png';
import './Signup.css';
import { FirebaseContext } from '../../Store/ContextFiles';
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

export default function Signup() {
  const [Username, setUsername] = useState('')
  const [Email, setEmail] = useState('')
  const [Phone, setPhone] = useState('')
  const [Passowrd, setPassword] = useState('')

  const { app } = useContext(FirebaseContext)
  const navigate = useNavigate()

  const auth = getAuth(app)
  const db = getFirestore()
  const userCollectionRef = collection(db, 'user')

  // Submitting SignUp informations
  const handleSubmit = (e) => {
    e.preventDefault()

    // New
    createUserWithEmailAndPassword(auth, Email, Passowrd)
      .then((res) => {
        res.user.updateProfile({ displayName: Username })
          .then(() => {
            addDoc(userCollectionRef, {
              id: res.user.uid,
              username: Username,
              phone: Phone
            })
          })
          .catch((err) => {
            alert(err.message)
            console.log(err.message)
          })
          .then(() => {
            navigate('/login')
          })
      })
  }

  // Rendering
  return (
    <div>

      <div className="signupParentDiv">
        <img width="500px" height="150px" src={Logo} alt='Err'></img>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">Username</label>
          <br />
          <input
            className="input"
            type="text"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            id="fname"
            name="name"
          // defaultValue="Typehere"
          />
          <br />
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            id="fname"
            name="email"
          // defaultValue="typehere@gmail.com"
          />
          <br />
          <label htmlFor="lname">Phone</label>
          <br />
          <input
            className="input"
            type="number"
            value={Phone}
            onChange={(e) => setPhone(e.target.value)}
            id="lname"
            name="phone"
          // defaultValue="00000"
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            value={Passowrd}
            onChange={(e) => setPassword(e.target.value)}
            id="lname"
            name="password"
          // defaultValue="Type@password"
          />
          <br />
          <br />
          <button>Signup</button>
        </form>
        <a href='/login'>Already have an account?</a>
      </div>

    </div>
  )
}
