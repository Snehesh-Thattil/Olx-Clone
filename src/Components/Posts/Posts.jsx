import './Posts.css'
import React, { useContext, useEffect } from 'react'
import { productsContext } from '../../Store/productContext'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import useDateFormat from '../../Hooks/useDateFormat'

function Posts() {
  const { products, setProducts } = useContext(productsContext)
  const navigate = useNavigate()
  const db = getFirestore()
  const { formatDate } = useDateFormat()

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

        {products?.sort((a, b) => new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds))
          .map((product, index) => {
            return (
              <div className="card" key={index} onClick={() => {
                navigate('/view', { state: { product } })
              }}>

                <i className="fa-solid fa-heart" onClick={(e) => e.stopPropagation()}></i>

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