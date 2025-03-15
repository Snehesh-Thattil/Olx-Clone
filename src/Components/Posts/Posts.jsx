import './Posts.css'
import React, { useContext, useMemo } from 'react'
import { ProductsContext } from '../../Store/productContext'
import { useNavigate } from 'react-router-dom'
import useDateFormat from '../../Hooks/useDateFormat'

function Posts({ search, MyAdsList }) {
  const { products } = useContext(ProductsContext)
  const navigate = useNavigate()
  const { formatDate } = useDateFormat()

  // Filter products on the basis of search
  const productsSearched = useMemo(() => {
    if (!search?.product && !search?.place) return products
    if (!products) return

    const productSearchKeywords = search.product.toLowerCase().split(" ")
    const placeSearchKeywords = search.place.toLowerCase().split(",").map((item) => item.trim())

    return [
      // Products that match all keywords
      ...products.filter((product) =>
        productSearchKeywords.every((word) =>
          `${product.Brand} ${product.Model} ${product.Variant} ${product.category} ${product.subcategory} ${product.Fuel}`
            .toLowerCase()
            .includes(word)
        )
      ),

      // Products that match at least one keyword (excluding already matched ones)
      ...products.filter((product) =>
        productSearchKeywords.some((word) =>
          `${product.Brand} ${product.Model} ${product.Variant} ${product.category} ${product.subcategory} ${product.Fuel}`
            .toLowerCase()
            .includes(word)
        ) &&
        !productSearchKeywords?.every((word) =>
          `${product.Brand} ${product.Model} ${product.Variant} ${product.category} ${product.subcategory} ${product.Fuel}`
            .toLowerCase()
            .includes(word)
        )
      )
    ].filter((item) => {
      return `${item.neighbourhood} ${item.district} ${item.state}`
        .toLowerCase()
        .includes(placeSearchKeywords[0])
    })
  }, [products, search])

  // Determine what products to show
  const showProducts = useMemo(() => {
    return MyAdsList && MyAdsList.length > 0 ? MyAdsList : MyAdsList ? [] : productsSearched
  }, [MyAdsList, productsSearched])

  // Sort products before rendering
  const sortedProducts = useMemo(() => {
    return showProducts?.sort((a, b) => new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds))
  }, [showProducts])

  // JSX
  return (
    <div className="Posts">

      <div className="heading">
        <span>{MyAdsList ? 'My Ad Listings' : search.product !== '' ? 'Search Results' : 'Fresh recommendations'}</span>
      </div>

      <div className="cards">

        {sortedProducts?.sort((a, b) => new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds))
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
                    .includes(product.category) && (
                      <p className="kilometer">{product.Year} - {product["KM driven"]}km</p>
                    )}
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