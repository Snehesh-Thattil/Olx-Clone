import './Posts.css'
import React, { useContext } from 'react'
import { ProductsContext } from '../../Store/productContext'
import { useNavigate } from 'react-router-dom'
import useDateFormat from '../../Hooks/useDateFormat'

function Posts({ MyAdsList }) {
  const { products } = useContext(ProductsContext)
  const navigate = useNavigate()
  const { formatDate } = useDateFormat()

  // Determine what products to show
  const showProducts = MyAdsList && MyAdsList.length > 0 ? MyAdsList : MyAdsList ? [] : products

  // JSX
  return (
    <div className="Posts">

      <div className="heading">
        <span>{MyAdsList ? 'My Ad Listings' : 'Fresh recommendations'}</span>
      </div>

      <div className="cards">

        {showProducts?.sort((a, b) => new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds))
          .map((product, index) => {
            return (
              <div className="card" key={index} onClick={() => {
                navigate('/view', { state: { product } })
              }}>

                {!MyAdsList && <i className="fa-solid fa-heart" onClick={(e) => e.stopPropagation()}></i>}

                <div className="image">
                  <img src={product.coverImgURL} alt="product-image" />
                </div>

                <div className="content">
                  <h2 className="rate">&#x20B9; {product.price}</h2>
                  {['Cars', 'Scooters', 'Motorcycles', 'Commercial & Other Vehicles']
                    .includes(product.category) ?
                    <p className="kilometer">{product.Year} - {product["KM driven"]}km</p> : ""}
                  <p className="name"> {product['ad-title']}</p>
                </div>

                <div className="place-date">
                  <p className='place'>{product.neighbourhood}, {product.state}</p>
                  <p className='date'>{formatDate(product.createdAt)}
                  </p>
                </div>

              </div>
            )
          })}
      </div>

    </div>
  )
}

export default Posts