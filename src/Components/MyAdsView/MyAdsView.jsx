import React, { useContext } from 'react'
import './MyAdsView.css'
import { ProductsContext } from '../../Store/productContext'
import { AuthContext } from '../../Store/AuthContext'
import Posts from '../Posts/Posts'

function MyAdsView() {
  const { products } = useContext(ProductsContext)
  const { user } = useContext(AuthContext)

  const MyAdsList = products?.filter(item => item.sellerInfo.userId === user?.userId) || []

  // JSX
  return (
    <div className='MyAdsView'>
      <div className='stats'>
        <h1>Yet to design</h1>
      </div>

      <Posts MyAdsList={MyAdsList} />
    </div>
  )
}

export default MyAdsView
