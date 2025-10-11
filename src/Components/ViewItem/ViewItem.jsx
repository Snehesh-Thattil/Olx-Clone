import React, { useContext, useMemo, useRef, useState } from 'react'
import './ViewItem.css';
import { useLocation, useNavigate } from 'react-router-dom';
import VerifiedUserTag from '../../Assets/Images/verified-user-icon.png'
import featuredIconTag from '../../Assets/Images/FeaturedIconTag.png'
import { ProductsContext } from '../../Store/ProductContext';
import RelatedItems from './SubComponents/RelatedItems';
import useDateFormat from '../../Hooks/useDateFormat';
import useStartChat from '../../Hooks/useStartChat';
import { AuthContext } from '../../Store/AuthContext';
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../Firebase/firebase-config';
import Loader from '../Loader/Loader';

function ViewItem() {
  const [load, setLoad] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [currentImgIndex, SetCurrentImgIndex] = useState(0)
  const { products } = useContext(ProductsContext)
  const { user } = useContext(AuthContext)
  const deleteBoxRef = useRef()

  const { formatDate } = useDateFormat()
  const { start } = useStartChat()

  const navigate = useNavigate()
  const location = useLocation()
  const { product } = location?.state || {}
  const { latitude, longitude } = product.sellerInfo?.coords || null

  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  const images = [product.coverImgURL, ...product.imgURLs]

  // Finding similar products to display
  const relatedItems = useMemo(() => {
    if (!product || !products) return []
    return products.filter((item) =>
      item.id !== product.id &&
      (
        item.subcategory?.toLowerCase() === product.subcategory?.toLowerCase() ||
        item.category?.toLowerCase() === product.category?.toLowerCase()
      )
    ).slice(0, 10)
  }, [product, products])

  // Image slide buttons action
  const handleNext = () => SetCurrentImgIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)
  const handlePrev = () => SetCurrentImgIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)

  // Share button to share page
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
          text: 'Check out this page!'
        })
      }
      catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard')
    }
  }

  // Handle product deletion as per sellers request
  const handleDeleteProduct = async () => {
    setLoad(true)
    const productDocRef = doc(db, "products", product.id)

    try {
      await deleteDoc(productDocRef)

      console.log("Successfully deleted product from firebase")
      navigate('/')
      window.location.reload()
    }
    catch (err) {
      alert("Error deleting the product :", err.message)
      console.error("Error deleting the product:", err.message)
    }
    finally {
      setLoad(false)
    }
  }


  // JSX
  if (load) return <Loader />
  return (
    <div className="ViewItem" >

      <div className='delete-product' ref={deleteBoxRef}>
        <div className="box">
          <h3>Delete product</h3>
          <p>You are about to permanently delete this product. Are you sure about this?</p>
          <div className="buttons">
            <button className='proceed' onClick={handleDeleteProduct}>Delete</button>
            <button onClick={() => {
              deleteBoxRef.current.style.display = 'none'
              document.body.style.overflow = "auto"
            }}>Cancel</button>
          </div>
        </div>
      </div>

      <div className="imageSection">
        <button className='prev' onClick={handlePrev} ><i className="fa-solid fa-chevron-left"></i></button>
        <button className='next' onClick={handleNext}><i className="fa-solid fa-chevron-right"></i></button>
        <img src={images[currentImgIndex]} alt="product-photo" />
        <button className='share' onClick={handleShare}><i className="fa-solid fa-share-nodes"></i></button>
        <button className="wishlist"><i className="fa-solid fa-heart"></i></button>

        {user?.uid === product.sellerInfo?.userId &&
          <button className='delete' onClick={() => {
            deleteBoxRef.current.style.display = 'flex'
            document.body.style.overflow = "hidden"
          }}>Delete</button>}

        {user?.uid === product.sellerInfo?.userId &&
          <button className='edit' onClick={() => navigate('/view/edit-item', { state: { editProduct: product } })}>Edit</button>}
      </div>

      <div className="productInfos">

        {['Cars', 'Scooters', 'Motorcycles', 'Commercial & Other Vehicles']
          .includes(product.category || product?.subcategory) ?
          <div className="details">
            {product.sellerInfo?.userVerified ? <img src={VerifiedUserTag} alt="loadimage" /> : <img src={featuredIconTag} alt='loadimage' />}
            <h1>{product?.Brand} {product?.Model} ({product?.Year})</h1>
            <h3>{product?.Variant || product?.Type}</h3>
            <h2>{product['ad-title']}</h2>

            <div className="features">
              <div className="feature">
                <i className="fa-solid fa-gas-pump"></i>
                <h4>{product?.Fuel} </h4>
              </div>

              <div className="feature">
                <i className="fa-solid fa-gauge-simple-high"></i>
                <h4>{product['KM driven']} KM</h4>
              </div>

              <div className="feature">
                <i className="fa-solid fa-gears"></i>
                <h4>{product?.Transmition}</h4>
              </div>

            </div>
          </div>
          : product.category === 'Mobiles' ?
            <div className='details'>
              {product.sellerInfo?.userVerified ? <img src={VerifiedUserTag} alt="loadimage" /> : <img src={featuredIconTag} alt='loadimage' />}
              <h1>{product?.Brand}</h1>
              <h2>{product['ad-title']}</h2>
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

            {product["No. of Owners"] !== undefined && product["No. of Owners"] !== "" &&
              <div className='item'>
                <i className="fa-solid fa-user"></i>
                <p>Owner<span>{product["No. of Owners"]}</span></p>
              </div>}

            <div className='item'>
              <i className="fa-solid fa-location-dot"></i>
              <p>Location<span>{product.neighbourhood}, {product.district}, {product.state}</span></p>
            </div>

            <div className='item'>
              <i className="fa-solid fa-calendar"></i>
              <p>Posting date<span>{formatDate(product.createdAt)}</span></p>
            </div>

          </div>
        </div>

        {product.sellerInfo &&
          <div className="sellerDetails">
            <div className="name-photo">
              {product.sellerInfo.photo && <img src={product.sellerInfo.photo} alt="seller-photo" />}
              <h2>{product?.sellerInfo.name}</h2>
            </div>

            {user?.uid === product.sellerInfo?.userId ?
              <button onClick={() => navigate('/profile')}>View My Profile</button>
              : <button onClick={() => start(user.id, product.sellerInfo.userId, product['ad-title'])}>Message as Interested</button>}

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
          {user?.uid === product.sellerInfo?.userId && <i className="fa-solid fa-pen"></i>}
          <h3>Description</h3>
          <pre>{product.description}</pre>
        </div>

        {relatedItems?.length > 0 && <RelatedItems products={relatedItems} />}

        <div className='mapView'>
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

export default ViewItem