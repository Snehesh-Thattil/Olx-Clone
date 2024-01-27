import './View.css';
import { PostContext } from '../../Store/productContext';
import { FirebaseContext } from '../../Store/ContextFiles'
import React, { useEffect, useState, useContext } from 'react'

function View() {
  const { Firebase } = useContext(FirebaseContext)
  const { ProdDtls } = useContext(PostContext)
  const [UserDtls, setUserDtls] = useState([])
  const { User } = ProdDtls

  useEffect(() => {
    Firebase.firestore().collection('user').where('id', '==', User).get().then((res) => {
      res.forEach(doc => {
        setUserDtls(doc.data())
      })
    })
  }, [Firebase, User])

  return (

    < div className="viewParentDiv" >
      <div className="imageShowDiv">
        <img src={ProdDtls.Url} alt="" />
      </div>
      <div className="rightSection">
        <div className="productDetails">
          <p>&#x20B9; {ProdDtls.Price} </p>
          <span>{ProdDtls.Name} </span>
          <p>{ProdDtls.Category}</p>
          <span>{ProdDtls.createdAt}</span>
        </div>
        {UserDtls && <div className="contactDetails">
          <p>{UserDtls.username}</p>
          <p>UID : {UserDtls.id}</p>
          <p>{UserDtls.phone}</p>
        </div>}
      </div>
    </div >
  )
}
export default View;
