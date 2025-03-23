import React, { useContext, useRef, useState } from 'react'
import '../ListingForm/ListingForm.css'
import { AuthContext } from '../../Store/AuthContext'
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updateProfile } from 'firebase/auth'
import { auth } from '../../Firebase/firbase-config'

function EditProfileView() {
    const { user } = useContext(AuthContext)
    const profilePicRef = useRef()
    const [update, setUpdate] = useState({
        email: user?.email || '',
        phone: user?.phone || '',
        name: user?.displayName || '',
        about: user?.about || '',
        address: user?.address || '',
        photo: user?.photoURL
    })

    console.log("ContextUser", user) // Temp

    const currUser = auth?.currentUser

    console.log("CurrentUser :", currUser) // Temp

    // Update email address of the user
    const changeEmail = async (newEmail, password) => {
        try {
            const credentials = EmailAuthProvider.credential(user?.email, password)
            await reauthenticateWithCredential(currUser, credentials)

            await updateEmail(currUser, newEmail)
            console.log("Email updated successfully!")
        }
        catch (err) {
            alert("Ohh no!, Something went wrong, cant update email")
            console.error("Error updating email", err.message)
        }
    }

    // Handle edited profile details submition
    const submitProfileEdit = () => {
        const passwordInput = prompt("Confirm your current password")

        if (user?.email !== update?.email) {
            changeEmail(update?.email, passwordInput)
        }

        if (currUser?.phoneNumber !== update?.phone) {
            changePhoneNumber(update?.phone, passwordInput)
        }

        updateProfile(currUser, {
            displayName: update?.name,
            about: update?.about, address: update?.address,
            photoURL: update?.photo,
            phoneNumber: update?.phone
        })
    }

    // Handle input field changes realtime
    const handleInputChange = (e) => {

        setUpdate((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
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
                            onChange={(e) => setUpdate({ ...update, photo: e.target.files[0] })}
                            ref={profilePicRef} />
                        <img className='editFormImg' src={update?.photo instanceof File ? URL.createObjectURL(update?.photo) : update?.photo || "https://img.icons8.com/?size=100&id=65342&format=png&color=000000"} onClick={() => profilePicRef.current?.click()} alt="user-profile" style={{ width: '7.5rem' }} />
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
