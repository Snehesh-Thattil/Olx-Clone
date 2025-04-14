import React, { useCallback, useContext } from 'react'
import './ProfileOptions.css'
import { AuthContext } from '../../Store/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../../Firebase/firebase-config'
import { useNavigate } from 'react-router-dom'
import { LoginBoxContext } from '../../Store/LoginBoxContext'

function ProfileOptions({ mobile }) {
    const { user } = useContext(AuthContext)
    const { setLoginBox } = useContext(LoginBoxContext)
    const navigate = useNavigate()

    // Signing out user
    const handleSignOut = useCallback(() => {
        signOut(auth)
            .then(() => {
                alert('signed out successfully')
                navigate('/')
                window.location.reload()
            })
            .catch((err) => console.log("Error signing out:", err.message))
    }, [navigate])

    // Verify user before proceeding certain clicks
    const handleVerifyUser = (path) => {
        if (user?.uid || user?.id) {
            navigate(path)
        } else {
            setLoginBox('Sign-up')
        }
    }

    // JSX
    return (
        <div className={mobile ? "ProfileOptions mobile" : "ProfileOptions"}>
            <div className="view-profile">
                <div className="info">
                    {user?.uid && <h2>{user.displayName?.slice(0, 1)}</h2>}
                    {user?.uid && <h3>{user.displayName}</h3>}
                </div>
                {user?.uid || user?.id ?
                    <button onClick={() => navigate('/profile')}>View and edit profile</button>
                    : <button onClick={() => setLoginBox('Sign-up')}>Sign up now</button>}
            </div>
            <li onClick={() => handleVerifyUser('/my-ads')}><i className="fa-solid fa-address-card"></i>My ADS</li>
            <li onClick={() => window.open('https://www.olx.in/payments/businesspackages/my_account', '_blank')}><i className="fa-solid fa-file-contract"></i>Buy Business Package</li>
            <li onClick={() => window.open('https://www.olx.in/myorders/orders', '_blank')}><i className="fa-regular fa-credit-card"></i>Bought Packages & Billing</li>
            {mobile && <li onClick={() => handleVerifyUser('/wishlist')}><i className="fa-regular fa-heart"></i>Wishlist</li>}
            {mobile && <li onClick={() => handleVerifyUser('/chats')}><i className="fa-regular fa-comment-dots"></i>Chats</li>}
            {mobile && <li onClick={() => navigate('/notifications')}><i className="fa-regular fa-bell"></i>Notifications</li>}
            <li onClick={() => navigate('/settings')}><i className="fa-solid fa-gear"></i>Settings</li>
            <li onClick={() => window.open('https://help.olx.in/hc/en-us', '_blank')}><i className="fa-solid fa-question"></i>Help</li>
            <li onClick={() => window.open('https://www.olx.in/settings/privacy', '_blank')}><i className="fa-solid fa-download"></i>Install OLX Lite app</li>
            {(user?.uid || user?.id) ?
                <li onClick={() => handleSignOut()}><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</li>
                : <li onClick={() => setLoginBox('Sign-up')}><i className="fa-solid fa-arrow-right-from-bracket"></i>Sign up</li>}
            {!mobile && <div className="pointer" ></div>}
        </div>
    )
}

export default ProfileOptions