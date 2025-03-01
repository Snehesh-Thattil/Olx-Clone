import React, { Fragment, useContext, useState } from 'react'
import './Create.css'
import Header from '../Header/Header'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Store/ContextFiles'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { getStorage, getDownloadURL, uploadBytes, ref } from 'firebase/storage'

const Create = () => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const { User } = useContext(AuthContext)

  const navigate = useNavigate()

  const date = new Date()
  const db = getFirestore()
  const storage = getStorage()

  const handleSubmit = () => {
    const productCollRef = collection(db, 'products')
    const path = (`/Image/${image.name}`)

    const storageRef = ref(storage, path)

    uploadBytes(storageRef, image)
      .then((snapshot) => {
        const downloadURL = getDownloadURL(snapshot.ref)
        return downloadURL
      })
      .then((downloadURL) => {
        addDoc(productCollRef, {
          name,
          category,
          price,
          imgUrl: downloadURL,
          userId: User.uid,
          createdAt: date.toDateString()
        })
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        alert(err.message)
        console.log(err.message)
      })
  }

  return (
    <Fragment>
      <Header />
      <card>
        <div className="centerDiv">

          <form>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product nname"
              name="Name"
            />

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Product category"
              name="category"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              name="Price"
            />
          </form>

          <img alt="Upload here" src={image ? URL.createObjectURL(image) : ''}></img><br />
          <input onChange={(e) => setImage(e.target.files[0])} type="file" /><br />
          <button onClick={handleSubmit} className="uploadBtn">upload and Submit</button>

        </div>
      </card>
    </Fragment>
  )
}

export default Create;
