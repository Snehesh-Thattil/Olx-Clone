import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ImageIcon from '../../Assets/Images/image-upload-icon.png'
import Loader from '../Loader/Loader'
import './ListingForm.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Store/AuthContext'
import { db, storage } from '../../Firebase/firbase-config'
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import DynamicFields from './SubComponents/DynamicFields'

// Map subcategories to form names
const FORM_NAME_MAP = {
    'Cars': 'car_form',
    'Accessories': 'accessories_form',
    'Mobile Phones': 'mobilePhone_form',
    'Tablets': 'tablet_form',
    'Scooters': 'scooter_form',
    'Motorcycles': 'motorcycle_form',
    'Bicycles': 'bicycle_form',
    'Commercial & Other Vehicles': 'vehicles_form',
    'Vehicle Spares': 'spares_form'
}

function ListingForm() {
    const location = useLocation()
    const navigate = useNavigate()
    const subcat = location.state?.subcategory || null
    const catgry = location.state?.category || null
    const fbFormName = FORM_NAME_MAP[subcat] || null

    const { user } = useContext(AuthContext)
    const [load, setLoad] = useState(false)
    const [fields, setFields] = useState([])
    const [images, setImages] = useState([])
    const [coverImage, setCoverImage] = useState()
    const [productInfo, setProductInfo] = useState({
        subcategory: subcat || null,
        category: catgry || null
    })
    const [sellerInfo, setSellerInfo] = useState({
        name: user?.displayName,
        userId: user?.uid,
        email: user?.email,
        photo: user?.photoURL,
        state: user?.state,
        district: user?.district,
        neighbourhood: user?.neighbourhood,
        coords: user?.coords
    })

    const profileInputRef = useRef()
    const imageInputRef = useRef()

    // Fetch form template for the selected subcategory
    useEffect(() => {
        const fetchForm = async () => {
            try {
                const docRef = doc(db, "formTemplates", fbFormName)
                const res = await getDoc(docRef)

                if (res.exists()) {
                    setFields(res.data().fields)
                } else {
                    console.error("No such document!")
                }
            } catch (err) {
                console.error("Error fetching formDoc", err.message)
            }
        }
        fetchForm()
    }, [fbFormName])

    // Handlers for Image upload delete and input changes
    const handleLocationChange = (e) => {
        setSellerInfo({ ...sellerInfo, [e.target.name]: e.target.value })
    }

    const handleProductInfoChange = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const handleUploadImage = useCallback((e) => {
        const files = Array.from(e.target.files)

        if (images.length + files.length > 12) {
            alert("You can only upload up to 12 images.")
            return
        }

        setImages((prev) => [...prev, ...files])

        if (!coverImage && files.length) {
            setCoverImage(files[0])
        }
    }, [images, coverImage])

    const handleDeleteImage = (img) => {
        setImages((prev) => {
            const updated = prev.filter((prevImg) => prevImg !== img)

            if (!updated.includes(coverImage)) {
                setCoverImage(updated.length > 0 ? updated[0] : null)
            }
            return updated
        })
    }

    // Helper functions to generate unique file names and upload files
    const generateUniqueFileName = (file) => {
        const timestamp = new Date()
        const randomStr = Math.random().toString(36).substring(2, 10)
        return `${timestamp}_${randomStr}_${file.name}`
    }

    const uploadFileAndGetURL = async (file, path) => {
        const storageRef = ref(storage, path)
        const snapshot = await uploadBytes(storageRef, file)
        return getDownloadURL(snapshot.ref)
    }

    // Handle form submition on submit button click
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setLoad(true)

        if (images.length === 0) {
            alert("Please upload at least one photo of the product")
            setLoad(false)
            return
        }
        if (!sellerInfo.photo && !user?.photoURL) {
            alert("Please upload the owners photo")
            setLoad(false)
            return
        }

        try {
            const productCollRef = collection(db, "products")

            const uploadPromises = images.map((img) => {
                const filename = generateUniqueFileName(img)
                return uploadFileAndGetURL(img, `/Images/products/${filename}`)
            })
            const imgURLs = await Promise.all(uploadPromises)

            const sellerPhotoName = generateUniqueFileName(sellerInfo.photo)
            const sellerPhotoURL = await uploadFileAndGetURL(sellerInfo.photo, `/Images/products/${sellerPhotoName}`)

            const coverImgName = generateUniqueFileName(coverImage)
            const coverImgURL = await uploadFileAndGetURL(coverImage, `/Images/products/${coverImgName}`)

            await addDoc(productCollRef, {
                ...productInfo,
                imgURLs,
                coverImgURL,
                sellerInfo: {
                    ...sellerInfo,
                    photo: sellerPhotoURL
                },
                state: sellerInfo.state,
                district: sellerInfo.district,
                neighbourhood: sellerInfo.neighbourhood,
                createdAt: serverTimestamp()
            })

            console.log('Successfully uploaded files and details')
            navigate('/')
        }
        catch (err) {
            alert(err.message)
            console.error("Error uploading details on firebase", err.message)
        }
        finally {
            setLoad(false)
        }
    }


    // JSX
    if (load) return <Loader />
    return (
        <div className='Listing'>
            <div className="navigate">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
                <p>Post Your Ad</p>
            </div>
            <div className="details">
                <h3>INCLUDE SOME DETAILS</h3>

                <form onSubmit={handleFormSubmit}>
                    {fields.length > 0 &&
                        <DynamicFields fields={fields} onChange={handleProductInfoChange} />}

                    <div className="input-section">
                        <div className="input-field">
                            <label htmlFor="">Ad title</label>
                            <input type="text" minLength={5} maxLength={70} name='ad-title' onChange={handleProductInfoChange} required />
                            <p>Mention the key features of your item (e.g. brand, model, age, type)</p>
                        </div>

                        <div className="input-field">
                            <label htmlFor="">Description</label>
                            <textarea type="text" minLength={10} maxLength={4096} name='description' onChange={handleProductInfoChange} required />
                            <p>Include condition, features and reason for selling</p>
                        </div>
                    </div>

                    <div className="input-section">
                        <h4>SET A PRICE</h4>
                        <div className="input-field price-input">
                            <label htmlFor="">Price</label>

                            <div className="price-input-wrapper">
                                <span className="currency-symbol">₹</span>
                                <input type="number"
                                    id="price"
                                    required
                                    name='price'
                                    min={10} max={999999999}
                                    onChange={handleProductInfoChange} />
                            </div>
                        </div>
                    </div>

                    <div className="input-section">
                        <h4>UPLOAD UP TO 12 PHOTOS</h4>
                        <div className="input-field">

                            <div className="images-grid">
                                <input type="file"
                                    multiple
                                    accept='image/*'
                                    ref={imageInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleUploadImage}
                                    disabled={images.length >= 12} />

                                {images.length < 12 &&
                                    <img src={ImageIcon} className="image-item add-photo" onClick={() => imageInputRef.current?.click()} alt="" />}

                                {images.map((img, index) => {
                                    return (
                                        <div key={index} className={coverImage === img ? "image-item cover" : "image-item"} >
                                            <img src={URL.createObjectURL(img)} alt="item-image" />
                                            <p onClick={() => setCoverImage(img)}> {coverImage === img ? 'Cover Image' : 'Set as Cover'}</p>
                                            <i className="fa-solid fa-xmark" onClick={() => handleDeleteImage(img)}></i>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>

                    <div className="input-section">
                        <h4>CONFIRM YOUR LOCATION</h4>

                        <div className="input-field">
                            <label htmlFor="">State</label>
                            <input type="text" minLength={5} maxLength={70}
                                value={sellerInfo?.state}
                                onChange={handleLocationChange}
                                name='state' required />
                        </div>
                        <div className="input-field">
                            <label htmlFor="">District</label>
                            <input type="text" minLength={5} maxLength={70}
                                value={sellerInfo?.district}
                                onChange={handleLocationChange}
                                name='district' required />
                        </div>
                        <div className="input-field">
                            <label htmlFor="">Neighbourhood</label>
                            <input type="text" minLength={5} maxLength={70}
                                value={sellerInfo?.neighbourhood}
                                onChange={handleLocationChange}
                                name='neighbourhood' required />
                        </div>
                    </div>

                    <div className="input-section">
                        <h4>REVIEW CONTACT INFO</h4>
                        <div className="contact-infos">

                            <div className="name-photo">
                                <input type="file"
                                    accept='image/*'
                                    ref={profileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => setSellerInfo({ ...sellerInfo, photo: e.target.files[0] })} />

                                <img src={sellerInfo.photo instanceof File ? URL.createObjectURL(sellerInfo?.photo) : sellerInfo?.photo || user?.photoURL || "https://img.icons8.com/?size=100&id=65342&format=png&color=000000"} onClick={() => profileInputRef.current?.click()} alt="" />

                                <div className="name-input input-field">
                                    <label htmlFor="">Name</label>
                                    <input type="text" defaultValue={user.displayName} minLength={3} maxLength={70} required />
                                </div>
                            </div>

                            <div className="phone">
                                <p>Phone number</p>
                                <h4>{user?.phoneNumber}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="input-section">
                        <button type='submit' className='submit-btn'>SUBMIT</button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default ListingForm