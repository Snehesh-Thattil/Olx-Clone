import React, { useContext, useEffect, useState } from 'react'
import './ViewItem.css';
import { useLocation } from 'react-router-dom';
import VerifiedUserTag from '../../Assets/Images/verified-user-icon.png'
import featuredIconTag from '../../Assets/Images/FeaturedIconTag.png'
import { productsContext } from '../../Store/productContext';
import RelatedItems from './SubComponents/RelatedItems';

function ViewItem() {
  const [showInfo, setShowInfo] = useState(false)
  const [relatedItems, setRelatedItems] = useState([])
  const location = useLocation()
  const { products } = useContext(productsContext)
  const { product, formatDate } = location?.state || null
  const { latitude, longitude } = product.sellerInfo?.coords
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  console.log(product)

  // Finding similar products to display
  useEffect(() => {
    const result = products?.filter((item) => item.category === product.category && item.subcategory === product.subcategory)
      .filter((item) => item.id !== product.id)
      .slice(0, 10)
    setRelatedItems(result)
  }, [product, products])

  // JSX
  return (
    <div className="ViewItem" >
      <div className="imageSection">
        <img src={product?.coverImgURL} alt="coverimage" />
      </div>

      <div className="productInfos">

        {['Cars', 'Scooters', 'Motorcycles', 'Commercial & Other Vehicles']
          .includes(product.category) ?
          <div className="details">
            {product.sellerInfo?.userVerified ? <img src={VerifiedUserTag} alt="loadimage" /> : <img src={featuredIconTag} alt='loadimage' />}
            <h1>{product.Brand} {product.Model} ({product.Year})</h1>
            <h3>{product.Variant}</h3>

            <div className="features">
              <div className="feature">
                <i className="fa-solid fa-gas-pump"></i>
                <h4>{product.Fuel} </h4>
              </div>

              <div className="feature">
                <i className="fa-solid fa-gauge-simple-high"></i>
                <h4>{product['KM driven']} KM</h4>
              </div>

              <div className="feature">
                <i className="fa-solid fa-gears"></i>
                <h4>{product.Transmition}</h4>
              </div>

            </div>
          </div>
          :
          <div className='details'>
            {product.sellerInfo?.userVerified ? <img src={VerifiedUserTag} alt="loadimage" /> : <img src={featuredIconTag} alt='loadimage' />}
            <h1>{product['ad-title']}</h1>
          </div>}

        <div className="price">
          <h1>&#x20B9; {product?.price} </h1>
          <p>does this price comes under your budget?</p>
          <button>Make an offer</button>
        </div>
      </div>

      <div className="otherDetails">
        <div className="overview">
          <h3>Overview</h3>

          <div className="items">
            <div className='item'>
              <i className="fa-solid fa-user"></i>
              <p>Owner<span>{product['No. of Owners']}</span></p>
            </div>
            <div className='item'>
              <i className="fa-solid fa-location-dot"></i>
              <p>Location<span>{product.neighbourhood}, {product.district}, {product.state}</span></p>
            </div>
            <div className='item'>
              <i className="fa-solid fa-calendar"></i>
              <p>Posting date<span>{formatDate}</span></p>
            </div>
          </div>
        </div>

        {product.sellerInfo &&
          <div className="sellerDetails">
            <div className="name-photo">
              {product.sellerInfo.photo && <img src={product.sellerInfo.photo} alt="seller-photo" />}
              <h2>{product?.sellerInfo.name}</h2>
            </div>

            <button>Chat with seller</button>

            <div className="phone">
              <i className="fa-solid fa-phone"></i>
              <div className='contacts-wrapper'>
                <p>{product.sellerInfo.phone ? (showInfo ? product.sellerInfo.phone : '**********') : ""}</p>
                <p>{product.sellerInfo.email ? (showInfo ? product.sellerInfo.email : '**********') : ""}</p>
              </div>
              <h4 onClick={() => setShowInfo(true)}>{!showInfo && "show number"}</h4>
            </div>
          </div>
        }

        <div className="description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>

        {relatedItems?.length > 0 && <RelatedItems products={relatedItems} />}

        <div className='map'>
          <iframe
            title="Seller Location Map"
            width="100%"
            height="300"
            src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${latitude},${longitude}`}
            allowFullScreen>
          </iframe>
        </div>

      </div>
    </div >
  )
}
export default ViewItem;