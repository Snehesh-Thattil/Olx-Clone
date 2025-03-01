import './ViewItem.css';
import React, { useEffect, useState, useContext } from 'react'
import { PostContext } from '../../Store/productContext';
import { AuthContext, FirebaseContext } from '../../Store/ContextFiles'
import { getFirestore, getDocs, collection, where, query } from 'firebase/firestore';

function ViewItem() {
  const { app } = useContext(FirebaseContext)
  const { prodDtls } = useContext(PostContext)
  const { user } = useContext(AuthContext)
  const [userDtls, setUserDtls] = useState([])
  const db = getFirestore()

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
  }, [db, app, user])

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
