import React, { useState, useContext } from 'react';
import Logo from '../../olx-logo.png';
import './Signup.css';
import { FirebaseContext } from '../../Store/FirebaseContext';
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [Username, setUsername] = useState('')
  const [Email, setEmail] = useState('')
  const [Phone, setPhone] = useState('')
  const [Passowrd, setPassword] = useState('')

  const { Firebase } = useContext(FirebaseContext)
  const db = Firebase.firestore()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    Firebase.auth().createUserWithEmailAndPassword(Email, Passowrd).then((res) => {
      res.user.updateProfile({ displayName: Username }).then(() => {
        db.collection('user').add({
          id: res.user.uid,
          username: Username,
          phone: Phone
        }).then(() => {
          navigate('/login')
        })
      })
    })
    console.log(Username)
    console.log(Email)
    console.log(Phone)
    console.log(Firebase)
  }
  return (
    <div>

      <div className="signupParentDiv">
        <img width="300px" height="150px" src={Logo} alt='Err'></img>
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
