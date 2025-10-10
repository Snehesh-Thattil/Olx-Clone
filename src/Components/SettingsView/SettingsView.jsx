import React, { useCallback, useEffect, useState } from 'react'
import { auth } from '../../Firebase/firebase-config'
import './SettingsView.css'
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/Loader'

function SettingsView() {
  const [action, setAction] = useState('')
  const [toggle, setToggle] = useState(false)
  const [load, setLoad] = useState(false)
  const [password, setPassword] = useState({ current: '', newPassword: '', confirmPassword: '' })
  const navigate = useNavigate()
  const userAuth = auth.currentUser

  useEffect(() => {
    if (action === 'logout-all' || action === 'delete-acc') {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [action])

  // Change password of the user
  const changePassword = async () => {
    const user = auth.currentUser
    if (!user) return

    setLoad(true)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/

    if (password.newPassword !== password.confirmPassword) {
      alert("Passwords does not matching!")
      setLoad(false)
      return
    }

    if (!passwordRegex.test(password.newPassword)) {
      alert("Password must be at least 6 characters, with uppercase, lowercase, and a special character.")
      setLoad(false)
      return
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password.current)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, password.confirmPassword)
      alert("Password updated successfully!")
      navigate('/')
      setPassword({ current: '', newPassword: '', confirmPassword: '' })
    }
    catch (error) {
      console.error("Error updating password:", error.message)
    }
    finally {
      setLoad(false)
    }
  }

  // Logout user from all devices
  const handleDeleteUser = useCallback(async () => {
    if (!userAuth) return alert("No user logged in")
    const password = prompt("Please enter your password to confirm account deletion")
    if (!password) return alert("Password is required to proceed")

    try {
      const credential = EmailAuthProvider.credential(userAuth.email, password)
      await reauthenticateWithCredential(userAuth, credential)
      await deleteUser(userAuth)
      alert("User deleted successfully")
      navigate('/')
    }
    catch (error) {
      console.error("Error deleting user:", error.message)
      alert(error.message)
    }
  }, [navigate, userAuth])

  // Logout from all devices with express.js (ref: server.js)
  const handleLogoutFromAllDevices = useCallback(async () => {
    if (!userAuth) return alert("No user logged in")

    try {
      const response = await fetch("http://localhost:5000/logout-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userAuth.uid }),
      })

      if (!response.ok) throw new Error("Failed to log out")

      const data = await response.json()
      alert(data.message)
      navigate("/")
      window.location.reload()
    }
    catch (err) {
      console.error("Error logging out from all devices:", err)
      alert("Failed to log out from all devices.", err.message)
    }
  }, [navigate, userAuth])

  // JSX
  if (load) return <Loader />
  return (
    <div className='SettingsView'>
      <div className="options">
        <li className={action === 'privacy' ? 'active' : ''} onClick={() => setAction('privacy')}>Privacy</li>
        <li className={action === 'logout-all' ? 'active' : ''} onClick={() => setAction('logout-all')}>Logout from all devices</li>
        <li className={action === 'delete-acc' ? 'active' : ''} onClick={() => setAction('delete-acc')}>Delete account</li>
        <li className={action === 'chat-safety' ? 'active' : ''} onClick={() => setAction('chat-safety')}>Chat safety tips</li>
      </div>

      <div className="actions">

        {action === 'privacy' && <div className="change-pswrd">
          <h3>Change Password</h3>
          <div className="content">
            <input type="password"
              name='current'
              placeholder='Current password'
              value={password?.current}
              onChange={(e) => setPassword((prev) => ({ ...prev, current: e.target.value }))}
            />
            <input type="password"
              name='change'
              placeholder='New password'
              value={password?.newPassword}
              onChange={(e) => setPassword((prev) => ({ ...prev, newPassword: e.target.value }))}
            />
            <input type="password"
              name='change'
              placeholder='Confirm password'
              value={password?.confirmPassword}
              onChange={(e) => setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
            <button onClick={changePassword} disabled={load}> {load ? "Changing..." : "Change Password"} </button>
          </div>
        </div>}

        {action === 'logout-all' && <div className='logout-all'>
          <div className="box">
            <h3>Logout from everywhere</h3>
            <p>You'll get logged out from all devices and browsers. Do you still want to continue?</p>
            <div className="buttons">
              <button className='proceed' onClick={handleLogoutFromAllDevices}>Logout</button>
              <button onClick={() => setAction('')}>Cancel</button>
            </div>
          </div>
        </div>}

        {action === 'delete-acc' && <div className='delete-acc'>
          <div className="box">
            <h3>Delete account</h3>
            <p>You are about to permanently delete your account. Are you sure about this?</p>
            <div className="buttons">
              <button className='proceed' onClick={handleDeleteUser}>Delete</button>
              <button onClick={() => setAction('')}>Cancel</button>
            </div>
          </div>
        </div>}

        {action === 'chat-safety' && <div className="chat-safety">
          <h3>Notifications</h3>
          <div className="content">
            <div className="setting-info">
              <strong>Safety Tips</strong>
              <p>Receive safety tips based on your chat activity</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={toggle}
                onChange={() => setToggle(!toggle)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>}

        {action === '' && <div className='nothing'>
          <i className="fa-solid fa-gears"></i>
        </div>}

      </div>
    </div>
  )
}

export default SettingsView
