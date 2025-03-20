import React from 'react'
import '../ListingForm/ListingForm.css'

function EditProfileView() {

    // Handle eidtted profile details submition
    const submitProfileEdit = () => {
        console.log('Yet to code')
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
                            <input type="text" minLength={3} maxLength={70} placeholder='Name' required />
                            <textarea minLength={10} maxLength={4060} placeholder='About me' />
                        </div>
                    </div>
                    <div className="input-section">
                        <div className="input-field">
                            <label htmlFor="">Address for communication</label>
                            <textarea minLength={10} maxLength={4060} placeholder='Address' />
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
                                        name='phone'
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
                                        name='email'
                                        placeholder='example@gmail.com'
                                        required />
                                </div>
                            </div>
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
