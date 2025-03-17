import React from 'react'
import MyAdsAndWishlist from '../Components/MyAds&Wishlist/MyAds&Wishlist'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'

function MyAds() {
    return (
        <div>
            <Header />
            <MyAdsAndWishlist MyAds />
            <Footer />
        </div>
    )
}

export default MyAds
