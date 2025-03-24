import React, { useContext, useRef, useState, useEffect } from 'react'
import '../ListingForm/ListingForm.css'
import { AuthContext } from '../../Store/AuthContext'
import { EmailAuthProvider, PhoneAuthProvider, reauthenticateWithCredential, sendEmailVerification, signInWithCredential, updateEmail, updateProfile } from 'firebase/auth';
import { auth, storage } from '../../Firebase/firebase-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { RecaptchaVerifier } from "firebase/auth"

function EditProfileView() {
    const { user } = useContext(AuthContext)
    const profilePicRef = useRef()
    const [password, setPassword] = useState('')
    const [update, setUpdate] = useState({
        email: '',
        phone: '',
        name: '',
        about: '',
        address: '',
        photo: ''
    })
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const currUser = auth?.currentUser

    console.log(currUser)

    // Sync user data with form state when context updates
    useEffect(() => {
        setUpdate({
            email: user?.email || '',
            phone: user?.phone || '',
            name: user?.displayName || '',
            about: user?.about || '',
            address: user?.address || '',
            photo: user?.photoURL || ''
        });
    }, [user])

    // Add reCAPTCHA verifier for security before sending OTP.
    useEffect(() => {
        const initializeRecaptcha = () => {
            const recaptchaContainer = document.getElementById("recaptcha-container")
            if (recaptchaContainer && !window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(
                    'recaptcha-container',
                    { size: "invisible" }, auth)
            }
        }

        // Delay initialization slightly to ensure DOM is ready
        const timer = setTimeout(initializeRecaptcha, 100)
        return () => clearTimeout(timer)
    }, [])

    // Function to update phone number
    const updatePhoneNumber = async (newPhone) => {
        if (!auth) {
            console.error("Firebase auth not initialized")
            return
        }

        if (!window.recaptchaVerifier) {
            alert("reCAPTCHA not initialized properly.")
            return
        }

        try {
            const provider = new PhoneAuthProvider(auth)
            const verificationId = await provider.verifyPhoneNumber(`+91${newPhone}`, window.recaptchaVerifier)

            const otp = prompt("Enter the OTP sent to your phone:")
            const credential = PhoneAuthProvider.credential(verificationId, otp)

            await signInWithCredential(auth, credential)
            console.log("Phone number updated successfully!")
        }
        catch (err) {
            console.error("Error updating phone number", err.message)
        }
    }

    // Function to update email after re-authentication
    const changeEmail = async (newEmail) => {
        try {
            const credential = EmailAuthProvider.credential(currUser?.email, password)
            await reauthenticateWithCredential(currUser, credential)

            await updateEmail(currUser, newEmail)
            console.log("Email updated successfully!")

            await sendEmailVerification(currUser)
            console.log("Verification email sent. Please check your inbox.")
        }
        catch (err) {
            alert("Ohh no! Something went wrong, can't update email")
            console.error("Error updating email", err.message)
        }
    }

    // Generates a unique filename for profile pictures
    const generateUniqueFileName = (file) => {
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 10)
        return `${timestamp}_${randomStr}_${file.name}`
    }

    // Uploads file to Firebase Storage and returns the download URL
    const uploadFileAndGetURL = async (file) => {
        const filename = generateUniqueFileName(file)
        const storageRef = ref(storage, `/Users/profile/${filename}`)
        const snapshot = await uploadBytes(storageRef, file)
        return getDownloadURL(snapshot.ref)
    }

    // Handles the profile update submission
    const submitProfileEdit = async (e) => {
        e.preventDefault()
        if (!password) {
            alert("Please enter your password to proceed.")
            return
        }

        if (user?.email !== update.email) {
            await changeEmail(update.email)
        }

        let profileURL = update.photo
        if (selectedPhoto) {
            profileURL = await uploadFileAndGetURL(selectedPhoto)
        }

        if (user?.phone !== update.phone) {
            await updatePhoneNumber(update.phone)
        }

        try {
            await updateProfile(currUser, {
                displayName: update.name,
                photoURL: profileURL,
            })
            console.log("Profile updated successfully!")
        } catch (err) {
            console.error("Error updating profile", err.message)
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
            <div id="recaptcha-container"></div>  {/* Change Later */}

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
                                <h5 className='note'><span>✅ Yay! Your phone is verified.</span></h5>
                            </div>
                            <div className="email">
                                <p>Email Id</p>
                                <div className='email-input'>
                                    <input type="email"
                                        maxLength="30"
                                        minLength="10"
                                        placeholder='example@gmail.com'
                                        value={update?.email}
                                        name='email'
                                        onChange={handleInputChange}
                                        required />
                                </div>
                                <h5 className='note'>{user?.emailVerified && <span>✅ Yay! Your email is verified.</span>} Email is never shared with external parties nor do we use it to spam you in any way.</h5>
                            </div>
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
