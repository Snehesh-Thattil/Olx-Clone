import React, { Fragment, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './Create.css';
import Header from '../Header/Header';
import { FirebaseContext, AuthContext } from '../../Store/ContextFiles'

const Create = () => {
  const [Name, setName] = useState('')
  const [Category, setCategory] = useState('')
  const [Price, setPrice] = useState('')
  const [Image, setImage] = useState('')

  const navigate = useNavigate()

  const { Firebase } = useContext(FirebaseContext)
  const { User } = useContext(AuthContext)
  const date = new Date()
  const db = Firebase.firestore()

  const handleSubmit = () => {
    Firebase.storage().ref(`/Image/${Image.name}`).put(Image).then(({ ref }) => {
      ref.getDownloadURL().then((url) => {

        db.collection('products').add({
          Name,
          Category,
          Price,
          Url: url,
          User: User.uid,
          CreatedAt: date.toDateString()
        }).then(() => {
          alert('New Product Added')
          navigate('/')
        })
      })
    })
  }

  return (
    <Fragment>
      <Header />
      <card>
        <div className="centerDiv">

          <form>
            <label htmlFor="fname">Name</label>
            <br />
            <input
              className="input"
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              id="fname"
              name="Name" /><br />

            <label htmlFor="fname">Category</label>
            <br />
            <input
              className="input"
              type="text"
              value={Category}
              onChange={(e) => setCategory(e.target.value)}
              id="fname"
              name="category" /><br />

            <label htmlFor="fname">Price</label>
            <br />
            <input
              className="input"
              type="number"
              value={Price}
              onChange={(e) => setPrice(e.target.value)}
              id="fname"
              name="Price" /><br />
          </form>

          <br />
          <img alt="Upload here" src={Image ? URL.createObjectURL(Image) : ''}></img>
          <br />
          <input onChange={(e) => setImage(e.target.files[0])} type="file" />
          <br />
          <button onClick={handleSubmit} className="uploadBtn">upload and Submit</button>

        </div>
      </card>
    </Fragment>
  )
}

export default Create;
