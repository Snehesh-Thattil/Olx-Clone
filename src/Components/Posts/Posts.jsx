import Heart from '../../Assets/Heart'
import './Posts.css'
import React, { useContext, useEffect } from 'react'
import { PostContext } from '../../Store/productContext'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

function Posts() {
  const { setProducts } = useContext(PostContext)
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
    <div className="postParentDiv">
      <div className="recommendations">

        <div className="heading">
          <span>Fresh recommendations</span>
        </div>

        <div className="cards">

          <div className="card">

            <div className="favorite">
              <Heart></Heart>
            </div>

            <div className="image">
              <img src="../../../Images/R15V3.jpg" alt="" />
            </div>

            <div className="content">
              <p className="rate">&#x20B9; 250000</p>
              <span className="kilometer">Two Wheeler</span>
              <p className="name"> YAMAHA R15V3</p>
            </div>

            <div className="date">
              <span>Tue May 04 2021</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Posts