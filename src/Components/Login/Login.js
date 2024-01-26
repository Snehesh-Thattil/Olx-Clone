import React from 'react';

import Logo from '../../olx-logo.png';
import './Login.css';

function Login() {
  return (
    <div>
      <div className="loginParentDiv">
        <img width="300px" height="150px" src={Logo} alt='Err'></img>
        <form>
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            id="fname"
            name="email"
          // defaultValue="John"
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="lname"
            name="password"
          // defaultValue="Doe"
          />
          <br />
          <br />
          <button>Login</button>
        </form>
        <a href='/signup'>New to OLX ?</a>
      </div>
    </div>
  )
}

export default Login;
