import Heart from '../../assets/Heart';
import './Post.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../../Store/ContextFiles'
import { PostContext } from '../../Store/productContext'

function Posts() {
  const { Firebase } = useContext(FirebaseContext)
  const { setProdDtls } = useContext(PostContext)
  const [Product, setProduct] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    Firebase.firestore().collection('products').get().then((snapshot) => {

      const allPosts = snapshot.docs.map((product) => {
        return {
          ...product.data(),
          id: product.id,
        }
      })
      setProduct(allPosts)
    })
  }, [Firebase])

  return (
    <div className="postParentDiv">
      <div className="moreView">

        <div className="heading">
          <span>Quick Menu</span>
          <span>View more</span>
        </div>

        <div className="cards">

          {Product.map(Product => {

            return (
              <div className="card" onClick={() => {
                setProdDtls(Product)
                navigate('/view')
              }}>
                <div className="favorite">
                  <Heart></Heart>
                </div>

                <div className="image">
                  <img src={Product.Url} alt="" />
                </div>

                <div className="content">
                  <p className="rate">&#x20B9; {Product.Price}</p>
                  <span className="kilometer">{Product.Category}</span>
                  <p className="name"> {Product.Name}</p>
                </div>

                <div className="date">
                  <span>{Product.CreatedAt}</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>

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

export default Posts;
