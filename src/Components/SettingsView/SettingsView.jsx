import { useCallback, useEffect, useMemo, useState } from 'react'
import './SettingsView.css'
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { getDatabase, ref as rtdbRef, serverTimestamp, set } from 'firebase/database'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { auth } from '../../Firebase/firebase-config'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/Loader'
import toast from 'react-hot-toast'

function SettingsView() {
  const [action, setAction] = useState('')
  const [toggle, setToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState({ current: '', newPassword: '', confirmPassword: '' })

  const db = useMemo(() => getDatabase(), [])
  const userAuth = auth.currentUser
  const navigate = useNavigate()

  // Handle scroll lock for modals
  useEffect(() => {
    document.body.style.overflow =
      action === "logout-all" || action === "delete-acc" ? "hidden" : "auto";
  }, [action])

  // Helper function to update user online status
  const updateUserStatus = useCallback(async () => {
    if (!userAuth) return;
    const userStatusRef = rtdbRef(db, `status/${userAuth.uid}`);

    await set(userStatusRef, {
      state: 'offline',
      lastSeen: serverTimestamp(),
    })
  }, [db, userAuth])

  // Change password of the user
  const changePassword = useCallback(async () => {
    if (!userAuth) return toast.error('Error : No user logged in')

    const { current, newPassword, confirmPassword } = password;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match")

    if (!passwordRegex.test(newPassword))
      return toast.error(
        "Password must be at least 6 characters, with uppercase, lowercase, and a special character."
      )

    setLoading(true)
    try {
      const credential = EmailAuthProvider.credential(userAuth.email, current)
      await reauthenticateWithCredential(userAuth, credential)
      await updatePassword(userAuth, confirmPassword)

      toast.success("Password updated successfully!")
      setPassword({ current: '', newPassword: '', confirmPassword: '' })
      navigate('/')
    }
    catch (error) {
      toast.error(`Error updating password: ${error.message}`)
      console.error(error)
    }
    finally {
      setLoading(false)
    }
  }, [password, userAuth, navigate])

  // Logout user from all devices
  const deleteUserAcc = useCallback(async () => {
    if (!userAuth) return toast.error("Error : No user logged in")
    const password = prompt("Please enter your password to confirm account deletion")
    if (!password) return toast.error("Password is required to proceed")

    setLoading(true)
    try {
      await updateUserStatus()

      const credential = EmailAuthProvider.credential(userAuth.email, password)
      await reauthenticateWithCredential(userAuth, credential)
      await deleteUser(userAuth)

      toast.success("User deleted successfully")
      navigate('/', { replace: true })
    }
    catch (error) {
      console.error("Error deleting user : ", error.message)
      toast.error(`Error deleting user : ${error.message}`)
    }
    finally {
      setLoading(false)
    }
  }, [navigate, userAuth, updateUserStatus])

  // Logout from all devices with express.js (ref: server.js)
  const logoutFromAllDevices = useCallback(async () => {
    if (!userAuth) return toast.error("Error : No user logged in");

    setLoading(true);
    try {
      await updateUserStatus();

      const functions = getFunctions()
      const logoutAll = httpsCallable(functions, "logoutAllDevices")
      const result = await logoutAll({ uid: userAuth.uid })

      toast.success(result.data.message)
      navigate("/", { replace: true })
    }
    catch (err) {
      console.error("Error logging out from all devices:", err)
      toast.error(`Failed to log out from all devices. ${err.message}`)
    }
    finally {
      setLoading(false)
    }
  }, [navigate, userAuth, updateUserStatus])


  // JSX
  if (loading) return <Loader />
  return (
    <div className='SettingsView'>
      {/* Sidebar Options */}
      <div className="options">
        {["privacy", "logout-all", "delete-acc", "chat-safety"].map((item) => (
          <li key={item} className={action === item ? "active" : ""} onClick={() => setAction(item)}>
            {item.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </li>
        ))}
      </div>

      {/* Content Area */}
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
            <button onClick={changePassword} disabled={loading}> {loading ? "Changing..." : "Change Password"} </button>
          </div>
        </div>}

        {action === 'logout-all' && <div className='logout-all'>
          <div className="box">
            <h3>Logout from everywhere</h3>
            <p>You'll get logged out from all devices and browsers. Do you still want to continue?</p>
            <div className="buttons">
              <button className='proceed' onClick={logoutFromAllDevices}>Logout</button>
              <button onClick={() => setAction('')}>Cancel</button>
            </div>
          </div>
        </div>}

        {action === 'delete-acc' && <div className='delete-acc'>
          <div className="box">
            <h3>Delete account</h3>
            <p>You are about to permanently delete your account. Are you sure about this?</p>
            <div className="buttons">
              <button className='proceed' onClick={deleteUserAcc}>Delete</button>
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
