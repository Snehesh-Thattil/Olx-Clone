import React, { useContext } from 'react'
import './Logout.css'
import { FirebaseContext } from '../../Store/ContextFiles'

function Logout() {
    const { Firebase } = useContext(FirebaseContext)
    Firebase.auth().signOut()
    return (
        <div className='whole'>
            <h1>You are now Logged out</h1>
        </div>
    )
}

export default Logout
