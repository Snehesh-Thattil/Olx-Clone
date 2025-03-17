import React, { useContext, useMemo } from 'react'
import './MyAds&Wishlist.css'
import { ProductsContext } from '../../Store/productContext'
import { AuthContext } from '../../Store/AuthContext'
import Posts from '../Posts/Posts'
import { useNavigate } from 'react-router-dom'

function MyAdsAndWishlist({ wishlist, MyAds }) {
  const { products } = useContext(ProductsContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Memoized ads stats calculation
  const { MyAdsList, totalValue } = useMemo(() => {
    const ads = products?.filter(item => item.sellerInfo.userId === user?.uid) || []
    const total = ads.reduce((acc, item) => acc + Number(item.price), 0)

    return { MyAdsList: ads, totalValue: total }
  }, [products, user?.uid])

  return (
    <div className="MyAdsView">
      {wishlist && user?.wishlist?.length > 0 ? <Posts title={'My Wishlist'} MyWishlist={user?.wishlist} />
        : wishlist && user?.wishlist?.length === 0 ?
          (<div className='empty-ads'>
            <h3>Oops! your wishlist is empty</h3>
            <button onClick={() => navigate('/')}>Add Now</button>
          </div>)
          :
          MyAds && MyAdsList?.length > 0 ? (
            <>
              <pre className="stats">
                <h3 className="title">Stats of Your Ad Listings</h3>
                <h4>You have {MyAdsList.length} ads listed</h4>
                <h4>You have Rs.{totalValue} total value of all ads listed</h4>
              </pre>
              <Posts title={'My Ads'} MyAdsList={MyAdsList} />
            </>
          ) : (
            <div className="empty-ads">
              <h3>You don't have any listings yet</h3>
              <button onClick={() => navigate('/post-ads-list')}>List Your First Ad Now</button>
            </div>
          )}
    </div>
  )
}

export default MyAdsAndWishlist