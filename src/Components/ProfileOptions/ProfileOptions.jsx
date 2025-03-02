import React, { useCallback, useContext } from 'react'
import './ProfileOptions.css'
import { AuthContext } from '../../Store/ContextFiles'
import { signOut } from 'firebase/auth'
import { auth } from '../../Firebase/firbase-config'
import { useNavigate } from 'react-router-dom'

function ProfileOptions({ mobile, setLoginBox }) {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    // Signing out user
    const handleSignOut = useCallback(() => {
        signOut(auth)
            .then(() => {
                alert('signed out successfully')
                window.location.reload()
            })
            .catch((err) => console.log("Error signing out:", err.message))
    }, [])

    // Verify user before proceeding certain clicks
    const handleVerifyUser = (path) => {
        if (user) {
            navigate(path)
        } else {
            setLoginBox('Login')
        }
    }

    // JSX
    return (
        <div className={mobile ? "ProfileOptions mobile" : "ProfileOptions"}>
            <div className="view-profile">
                <div className="info">
                    <h2>{user?.displayName.slice(0, 1)}</h2>
                    <h3>{user?.displayName}</h3>
                </div>
                <button>View and edit profile</button>
            </div>
            <li><i className="fa-solid fa-address-card"></i>My ADS</li>
            <li><i className="fa-solid fa-file-contract"></i>Buy Business Package</li>
            <li><i className="fa-regular fa-credit-card"></i>Bought Packages & Billing</li>
            {mobile && <li onClick={() => handleVerifyUser('/wishlist')}><i className="fa-regular fa-heart"></i>Wishlist</li>}
            {mobile && <li onClick={() => handleVerifyUser('/chats')}><i className="fa-regular fa-comment-dots"></i>Chats</li>}
            {mobile && <li><i className="fa-regular fa-bell"></i>Notifications</li>}
            <li><i className="fa-solid fa-gear"></i>Settings</li>
            <li><i className="fa-solid fa-question"></i>Help</li>
            <li><i className="fa-solid fa-download"></i>Install OLX Lite app</li>
            <li onClick={() => handleSignOut()}><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</li>
            {!mobile && <div className="pointer" ></div>}
        </div>
    )
}

export default ProfileOptions
