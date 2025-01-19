import './View.css';
import React, { useEffect, useState, useContext } from 'react'
import { PostContext } from '../../Store/productContext';
import { AuthContext, FirebaseContext } from '../../Store/ContextFiles'
import { getFirestore, getDocs, collection, where, query } from 'firebase/firestore';

function View() {
  const { app } = useContext(FirebaseContext)
  const { ProdDtls } = useContext(PostContext)
  const { User } = useContext(AuthContext)
  const [UserDtls, setUserDtls] = useState([])
  const db = getFirestore()

  // Fetching product details from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('id', '==', User.uid)
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
  }, [db, app, User])

  // Rendering
  return (
    < div className="viewParentDiv" >
      <div className="imageShowDiv">
        <img src={ProdDtls.imgUrl} alt="" />
      </div>
      <div className="rightSection">
        <div className="productDetails">
          <p>&#x20B9; {ProdDtls.price} </p>
          <span>{ProdDtls.name} </span>
          <p>{ProdDtls.category}</p>
          <span>{ProdDtls.createdAt}</span>
        </div>
        {UserDtls && <div className="contactDetails">
          <p>{UserDtls.name}</p>
          <p>UID : {UserDtls.id}</p>
          <p>{UserDtls.phone}</p>
          <p>{UserDtls.email}</p>
        </div>}
      </div>
    </div >
  )
}
export default View;
