import React, { useContext, useRef, useState } from 'react'
import '../ListingForm/ListingForm.css'
import { AuthContext } from '../../Store/AuthContext'
import { EmailAuthCredential, reauthenticateWithCredential, updateProfile } from 'firebase/auth'
import { auth, storage, db } from '../../Firebase/firebase-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { query, updateDoc } from 'firebase/firestore'
import { collection, getDocs, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function EditProfileView() {
    const { user, setUser } = useContext(AuthContext)
    const [password, setPassword] = useState('')
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [update, setUpdate] = useState({
        phone: user?.phone || '',
        name: user?.displayName || '',
        about: user?.about || '',
        address: user?.address || '',
        photo: user?.photoURL || ''
    })
    const profilePicRef = useRef()
    const navigate = useNavigate()

    // Uploads file to Firebase Storage and returns the download URL
    const uploadFileAndGetURL = async (file) => {
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 10)
        const filename = `${timestamp}_${randomStr}_${file.name}`

        const storageRef = ref(storage, `/Images/Users/${filename}`)
        const snapshot = await uploadBytes(storageRef, file)
        return getDownloadURL(snapshot.ref)
    }

    // Handles the profile update submission
    const submitProfileEdit = async (e) => {
        e.preventDefault()
        if (!password) return alert('Please enter your password.')
        const currUser = auth?.currentUser

        try {
            const credential = EmailAuthCredential(currUser.email, password)
            await reauthenticateWithCredential(currUser, credential)

            let profileURL = selectedPhoto ? await uploadFileAndGetURL(selectedPhoto) : update.photo
            await updateProfile(currUser, { displayName: update.name, photoURL: profileURL })

            const q = query(collection(db, 'users'), where('id', '==', user.uid))
            const snapshot = await getDocs(q)

            await updateDoc(snapshot.docs[0].ref, {
                about: update.about,
                address: update.address,
                phone: update.phone
            })

            setUser((prev) => ({
                ...prev,
                photoURL: profileURL,
                displayName: update.name,
                about: update.about,
                address: update.address,
                phone: update.phone
            }))

            console.log("Profile updated successfully")
            navigate('/profile')
        }
        catch (err) {
            console.error('Error updating profile:', err.message)
        }
    }

    // Handles real-time form input changes
    const handleInputChange = (e) => {
        setUpdate(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // Handles profile picture selection
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedPhoto(e.target.files[0])
        }
    }

    // JSX
    return (
        <div className='EditProfileForm'>
            <div className="details">
                <h3>Edit Profile</h3>

                <form action="" onSubmit={submitProfileEdit}>
                    <div className="input-section">
                        <div className="input-field">
                            <label htmlFor="">Basic information</label>
                            <input type="text"
                                minLength={3}
                                maxLength={70}
                                placeholder='Name'
                                value={update?.name}
                                name='name'
                                onChange={handleInputChange}
                                required />
                            <textarea
                                minLength={10}
                                maxLength={4060}
                                placeholder='About me'
                                value={update?.about}
                                name='about'
                                onChange={handleInputChange}
                                required />
                            <h5 className='note'> <span>💡 Why is it important?</span> OLX is built on trust. Help other people get to know you. Tell them about the things you like. Share your favorite brands, books, movies, shows, music, food. And you will see the results…</h5>
                        </div>
                    </div>
                    <div className="input-section">
                        <div className="input-field">
                            <label htmlFor="">Address for communication</label>
                            <textarea
                                minLength={10}
                                maxLength={4060}
                                placeholder='Address'
                                value={update?.address}
                                name='address'
                                onChange={handleInputChange}
                                required />
                            <h5 className='note'>🏠 Your address helps the buyers to reach you for collecting the product.</h5>
                        </div>
                    </div>
                    <div className="input-section">
                        <h4>Contact information</h4>
                        <div className="contact-infos">
                            <div className="phone">
                                <p>Phone number</p>
                                <div className='phone-input'>
                                    <span>+91</span>
                                    <input type="tel"
                                        maxLength="10"
                                        minLength="10"
                                        pattern="\d{10}"
                                        prefix='+91'
                                        value={update?.phone}
                                        name='phone'
                                        onChange={handleInputChange}
                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10)}
                                        required />
                                </div>
                            </div>
                            <div className="email">
                                <p>Email Id</p>
                                <div className='email-input'>
                                    <input type="email"
                                        maxLength="30"
                                        minLength="10"
                                        value={user?.email}
                                        readOnly
                                        name='email'
                                        required />
                                </div>
                            </div>
                            <h5 className='note'>{user?.emailVerified && <span>✅ Yay! Your email is verified.</span>} Email and phone never shared with external parties nor do we use it to spam you in any way.</h5>
                        </div>
                    </div>
                    <div className="input-section">
                        <h4>Profile photo</h4>
                        <input type="file"
                            accept='image/*'
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            ref={profilePicRef} />
                        <img className='editFormImg' src={selectedPhoto ? URL.createObjectURL(selectedPhoto) : update?.photo || "https://img.icons8.com/?size=100&id=65342&format=png&color=000000"} onClick={() => profilePicRef.current?.click()} alt="user-profile" style={{ width: '7.5rem' }} />
                    </div>
                    <div className="input-section">
                        <div className="input-field">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <p>Enter your password for confirmation</p>
                        </div>
                    </div>
                    <div className="input-section">
                        <button type='submit' className='submit-btn editProfile'>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfileView
