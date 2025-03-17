import React from 'react'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import MyAdsAndWishlist from '../Components/MyAds&Wishlist/MyAds&Wishlist'

function Wishlist() {
  return (
    <div>
      <Header />
      <MyAdsAndWishlist wishlist />
      <Footer />
    </div>
  )
}

export default Wishlist