import './ViewItem.css';
import React, { useEffect, useState, useContext } from 'react'
import { PostContext } from '../../Store/productContext';
import { AuthContext } from '../../Store/AuthContext'
import { getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../../Firebase/firbase-config';

function ViewItem() {
  const { prodDtls } = useContext(PostContext)
  const { user } = useContext(AuthContext)
  const [userDtls, setUserDtls] = useState([])

  // Fetching product details from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('id', '==', user.uid)
    )

    getDocs(q)
      .then((docs) => {
        docs.forEach((doc) => {
          setUserDtls(doc.data())
        })
      })
      .catch((err) => {
        alert(err.message)
        console.log(err.message)
      })
  }, [user])

  // Rendering
  return (
    <div className="viewParentDiv" >
      <div className="imageShowDiv">
        <img src={prodDtls.imgUrl} alt="" />
      </div>
      <div className="rightSection">
        <div className="productDetails">
          <p>&#x20B9; {prodDtls.price} </p>
          <span>{prodDtls.name} </span>
          <p>{prodDtls.category}</p>
          <span>{prodDtls.createdAt}</span>
        </div>
        {userDtls && <div className="contactDetails">
          <p>{userDtls.name}</p>
          <p>UID : {userDtls.id}</p>
          <p>{userDtls.phone}</p>
          <p>{userDtls.email}</p>
        </div>}
      </div>
    </div >
  )
}
export default ViewItem;