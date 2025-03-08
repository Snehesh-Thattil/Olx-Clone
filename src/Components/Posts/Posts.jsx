import './Posts.css'
import React, { useContext, useEffect } from 'react'
import { PostContext } from '../../Store/productContext'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function Posts() {
  const { products, setProducts } = useContext(PostContext)
  const navigate = useNavigate()
  const db = getFirestore()

  // Fetching products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollRef = collection(db, 'products')

      try {
        const snapshot = await getDocs(productsCollRef)
        const allProducts = snapshot.docs.map((product) => {
          return {
            ...product.data(),
            id: product.id
          }
        })
        setProducts(allProducts)
      }
      catch (err) {
        console.error("Error fetching products", err.message)
      }
    }
    fetchProducts()
  }, [db, setProducts])

  // JSX
  return (
    <div className="Posts">

      <div className="heading">
        <span>Fresh recommendations</span>
      </div>

      <div className="cards">

        {products?.slice().reverse().map((product, index) => {
          return (
            <div className="card" key={index} onClick={() => navigate('/view', { state: { product } })}>

              <div className="wishlist" onClick={(e) => e.stopPropagation()}>
                <i className="fa-regular fa-heart"></i>
              </div>

              <div className="image">
                <img src={product.coverImgURL} alt="product-image" />
              </div>

              <div className="content">
                <h2 className="rate">&#x20B9; {product.price}</h2>
                {['Car', 'Scooters', 'Motorcycles', 'Commercial & Other Vehicles']
                  .includes(product.category) ?
                  <span className="kilometer">{product.Year} - {product["KM driven"]}km</span> : ""}
                <p className="name"> {product['ad-title']}</p>
              </div>

              <div className="place-date">
                <p className='place'>{product.neighbourhood}, {product.state}</p>
                <p className='date'>{(() => {
                  const createdDate = new Date(product.createdAt.seconds * 1000).toLocaleDateString()
                  const today = new Date().toLocaleDateString()
                  const findYesterday = new Date()
                  findYesterday.setDate(findYesterday.getDate() - 1)
                  const yesterday = findYesterday.toLocaleDateString()

                  if (createdDate === today) {
                    return "Today"
                  }
                  else if (createdDate === yesterday) {
                    return "Yesterday"
                  }
                  else {
                    return createdDate
                  }
                })()}
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