import React, { useContext, useMemo } from 'react'
import './ProfileView.css'
import Posts from '../Posts/Posts'
import { AuthContext } from '../../Store/AuthContext'
import { ProductsContext } from '../../Store/ProductContext'
import { useNavigate } from 'react-router-dom'

function ProfileView() {
    const { user } = useContext(AuthContext)
    const { products } = useContext(ProductsContext)
    const navigate = useNavigate()

    const MyAdsList = useMemo(() => {
        return products?.filter((item) => item.sellerInfo.userId === user.uid) || []
    }, [products, user?.uid])

    // JSX
    return (
        <div className='ProfileView'>
            <div className="profile-card">
                <div className="img-and-name">
                    <img className="profile-image" src={user?.photoURL || "https://img.icons8.com/?size=100&id=65342&format=png&color=000000"} alt="Profile" />
                    <h2 className="profile-name">Snehesh Thattil</h2>
                </div>
                <div className="infos">
                    <p className="profile-info">Member since Jun 2021</p>
                    <p className="profile-stats">0 Followers | 0 Following</p>
                    <p className="profile-location">Paravoor, Ernakulam, Kerala</p>
                </div>

                <div className="buttons">
                    <button className="edit-button" onClick={() => navigate('/profile/edit-profile')}>Edit Profile</button>
                    <button className="share-profile">Share Profile</button>
                </div>
            </div>

            <div className="my-ads-section">
                <Posts fromProfile title="My Ads" MyAdsList={MyAdsList} />
                <i className="fa-solid fa-arrow-up-right-from-square" onClick={() => navigate('/my-ads')}></i>
            </div>
        </div>
    )
}

export default ProfileView