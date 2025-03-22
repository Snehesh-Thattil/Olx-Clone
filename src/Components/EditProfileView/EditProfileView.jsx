import React, { useContext, useRef, useState } from 'react'
import './EditProfileView.css'
import '../ListingForm/ListingForm.css'
import { AuthContext } from '../../Store/AuthContext'
import { updateEmail } from 'firebase/auth'

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

    console.log(user)

    // Handle eidtted profile details submition
    const submitProfileEdit = () => {
        try {
            if (user?.email !== update?.email) {
                // updateEmail(user)
            }
        }
        catch (err) {
            console.error("Error updating email", err.message)
        }
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
        <div className='EditProfileForm' style={{ paddingTop: '8rem' }}>
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
                                <div className='phone-input'>
                                    <input type="email"
                                        maxLength="30"
                                        minLength="10"
                                        placeholder='example@gmail.com'
                                        value={update?.email}
                                        name='email'
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-section">
                        <h4>Profile photo</h4>
                        <input type="file"
                            accept='image/*'
                            style={{ display: 'none' }}
                            ref={profilePicRef} />
                        <img src={user?.photoURL || "https://img.icons8.com/?size=100&id=65342&format=png&color=000000"} onClick={() => profilePicRef.current?.click()} alt="user-profile" style={{ width: '7.5rem' }} />
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
