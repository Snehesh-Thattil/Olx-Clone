import React, { useCallback, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageIcon from '../../Assets/Images/image-upload-icon.png'
import Loader from '../Loader/Loader'
import '../ListingForm/ListingForm.css'
import { db, storage } from '../../Firebase/firebase-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'

function ItemEditForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const { editProduct } = location.state || {}

    const [load, setLoad] = useState(false)
    const [changed, setChanged] = useState(editProduct ? { ...editProduct } : {})
    const [images, setImages] = useState([changed?.coverImgURL, ...changed?.imgURLs])
    const [coverImage, setCoverImage] = useState(changed?.coverImgURL)

    const profileInputRef = useRef()
    const imageInputRef = useRef()

    // handler functions for input changes
    const handleProductInfoChange = (e, value) => {
        setChanged((prev) => ({
            ...prev,
            [e.target.name]: value || e.target.value
        }))
    }

    const handleUploadImage = useCallback((e) => {
        const files = Array.from(e.target.files)

        if (changed.imgURLs.length + files.length > 12) {
            alert("You can only upload up to 12 images.")
            return
        }

        setImages((prev) => [...prev, ...files])

        setChanged((prev) => ({
            ...prev,
            imgURLs: [...changed.imgURLs, ...files]
        }))

        if (!coverImage && files.length) setCoverImage(files[0])
    }, [changed?.imgURLs, coverImage])

    const handleDeleteImage = (deleteImg) => {
        const newImgURLs = images.filter((img) => img !== deleteImg)

        setImages(newImgURLs)
        setChanged((prev) => ({
            ...prev,
            imgURLs: newImgURLs,
            coverImgURL: newImgURLs[0]
        }))

        if (deleteImg === coverImage) setCoverImage(newImgURLs[0])
    }

    const handleSellerPhotoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setChanged((prev) => ({
            ...prev,
            sellerInfo: {
                ...prev.sellerInfo,
                photo: file
            }
        }))
    }

    const handleSellerInfoChange = (e) => {
        setChanged((prev) => ({
            ...prev,
            sellerInfo: {
                ...prev.sellerInfo,
                [e.target.name]: e.target.value
            }
        }))

        if (e.target.name === 'state' || e.target.name === 'district' || e.target.name === 'neighbourhood') {
            setChanged((prev) => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
        }
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

    // Update details as per the user modifications
    const handleModificationSubmit = async (e) => {
        e.preventDefault()
        setLoad(true)

        if (images.length === 0) {
            alert("Please upload at least one photo of the product")
            setLoad(false)
            return
        }
        if (!changed.sellerInfo.photo && !editProduct.sellerInfo.photo) {
            alert("Please upload the owners photo")
            setLoad(false)
            return
        }

        try {
            const productDocRef = doc(db, "products", editProduct.id)

            // Upload non-cover images if they are new (File instances), otherwise reuse existing URLs
            const updatedImageURLs = await Promise.all(
                images.filter((img) => img !== coverImage).map(async (img) => {
                    if (img instanceof File) {
                        const filename = generateUniqueFileName(img)
                        const url = await uploadFileAndGetURL(img, `/Images/products/${filename}`)
                        return url
                    }
                    else {
                        return img
                    }
                })
            )

            // Upload cover image if it's a new File, otherwise reuse existing one
            let updatedCoverImg
            if (coverImage !== editProduct.coverImgURL && coverImage instanceof File) {
                const filename = generateUniqueFileName(coverImage)
                const coverUrl = await uploadFileAndGetURL(coverImage, `/Images/products/${filename}`)
                updatedCoverImg = coverUrl
            } else {
                updatedCoverImg = coverImage
            }

            // Upload seller's photo if it's a new File, otherwise reuse existing one
            let updatedSellerPhoto
            if (changed.sellerInfo?.photo instanceof File) {
                const filename = generateUniqueFileName(changed.sellerInfo.photo)
                const sellerPhotoUrl = await uploadFileAndGetURL(changed.sellerInfo.photo, `/Images/users/${filename}`)
                updatedSellerPhoto = sellerPhotoUrl
            } else {
                updatedSellerPhoto = changed.sellerInfo.photo
            }

            // Finally, Update Firestore document with the new product details and images
            const updatedProduct = {
                ...changed,
                imgURLs: updatedImageURLs,
                coverImgURL: updatedCoverImg,
                sellerInfo: {
                    ...changed.sellerInfo,
                    photo: updatedSellerPhoto
                }
            }
            await updateDoc(productDocRef, updatedProduct)

            console.log('Successfully modified details and files')
            navigate('/view', { state: { product: updatedProduct } })
        }
        catch (err) {
            alert(err.message)
            console.error("Error modifying details of the ad", err.message)
        }
        finally {
            setLoad(false)
        }
    }


    // JSX
    if (load) return <Loader />
    return (
        <div className='ItemEditForm'>
            <div className="navigate">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
                <p>Edit Your Ad</p>
            </div>

            <div className="details">
                <h3>MAKE CHANGES IN YOUR AD</h3>

                <form onSubmit={handleModificationSubmit}>
                    {['Cars', 'Commercial & Other Vehicles']
                        .includes(editProduct?.category) ?
                        <div className="input-section">
                            <div className="input-field">
                                <label htmlFor="">Brand</label>
                                <input type="text" minLength={2} maxLength={70} name='Brand' defaultValue={editProduct.Brand || null} onChange={handleProductInfoChange} required />
                            </div>
                            <div className="input-field">
                                <label htmlFor="">Model</label>
                                <input type="text" minLength={2} maxLength={70} name='Model' defaultValue={editProduct.Model || null} onChange={handleProductInfoChange} required />
                            </div>
                            <div className="input-field">
                                <label htmlFor="">Variant</label>
                                <input type="text" minLength={2} maxLength={70} name='Variant' defaultValue={editProduct.Variant || null} onChange={handleProductInfoChange} required />
                            </div>
                            <div className="input-field">
                                <label htmlFor="">Year</label>
                                <input type="text" min={1947} max={2025} name='Year' defaultValue={editProduct.Year || null} onChange={handleProductInfoChange} required />
                            </div>
                            <div className="input-field">
                                <label htmlFor="">Fuel</label>

                                <div className="radios">
                                    <label htmlFor="">Petrol
                                        <input type="radio" name='Fuel' checked={changed?.Fuel === 'Petrol'} onChange={(e) => handleProductInfoChange(e, 'Petrol')} required />
                                    </label>
                                    <label htmlFor="">Diesel
                                        <input type="radio" name='Fuel' checked={changed?.Fuel === 'Diesel'} onChange={(e) => handleProductInfoChange(e, 'Diesel')} required />
                                    </label>
                                    <label htmlFor="">Electric
                                        <input type="radio" name='Fuel' checked={changed?.Fuel === 'Electric'} onChange={(e) => handleProductInfoChange(e, 'Electric')} required />
                                    </label>
                                    <label htmlFor="">CNG & Hybrid
                                        <input type="radio" name='Fuel' checked={changed?.Fuel === 'CNG & Hybrid'} onChange={(e) => handleProductInfoChange(e, 'CNG & Hybrid')} required />
                                    </label>
                                    <label htmlFor="">LPG
                                        <input type="radio" name='Fuel' checked={changed?.Fuel === 'LPG'} onChange={(e) => handleProductInfoChange(e, 'LPG')} required />
                                    </label>
                                </div>
                            </div>
                            <div className="input-field">
                                <label htmlFor="">Transmition</label>

                                <div className="radios">
                                    <label htmlFor="">Manual
                                        <input type="radio" name='Transmition' checked={changed?.Transmition === 'Manual'} onChange={(e) => handleProductInfoChange(e, 'Manual')} required />
                                    </label>
                                    <label htmlFor="">Automatic
                                        <input type="radio" name='Transmition' checked={changed?.Transmition === 'Automatic'} onChange={(e) => handleProductInfoChange(e, 'Automatic')} required />
                                    </label>
                                </div>
                            </div>
                            <div className="input-field">
                                <label htmlFor="">KM driven</label>
                                <input type="text" min={0} max={999999} name='KM driven' defaultValue={editProduct['KM driven'] || null} onChange={handleProductInfoChange} required />
                            </div>
                            <div className="input-field">
                                <label htmlFor="">No. of Owners</label>

                                <div className="radios">
                                    <label htmlFor="">1st
                                        <input type="radio" name='No. of Owners' checked={changed['No. of Owners'] === '1st'} onChange={(e) => handleProductInfoChange(e, '1st')} required />
                                    </label>
                                    <label htmlFor="">2nd
                                        <input type="radio" name='No. of Owners' checked={changed['No. of Owners'] === '2nd'} onChange={(e) => handleProductInfoChange(e, '2nd')} required />
                                    </label>
                                    <label htmlFor="">3rd
                                        <input type="radio" name='No. of Owners' checked={changed['No. of Owners'] === '3rd'} onChange={(e) => handleProductInfoChange(e, '3rd')} required />
                                    </label>
                                    <label htmlFor="">4th
                                        <input type="radio" name='No. of Owners' checked={changed['No. of Owners'] === '4th'} onChange={(e) => handleProductInfoChange(e, '4th')} required />
                                    </label>
                                    <label htmlFor="">4+
                                        <input type="radio" name='No. of Owners' checked={changed['No. of Owners'] === '4+'} onChange={(e) => handleProductInfoChange(e, '4+')} required />
                                    </label>
                                </div>
                            </div>
                        </div>

                        : editProduct?.subcategory === 'Scooters' || editProduct?.subcategory === 'Motorcycles' ?
                            <div className="input-section">
                                <div className="input-field">
                                    <label htmlFor="">Brand</label>
                                    <input type="text" minLength={2} maxLength={70} name='Brand' defaultValue={editProduct.Brand || null} onChange={handleProductInfoChange} required />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="">Model</label>
                                    <input type="text" minLength={2} maxLength={70} name='Model' defaultValue={editProduct.Model || null} onChange={handleProductInfoChange} required />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="">Year</label>
                                    <input type="text" min={1947} max={2025} name='Year' defaultValue={editProduct.Year || null} onChange={handleProductInfoChange} required />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="">KM driven</label>
                                    <input type="text" min={0} max={999999} name='KM driven' defaultValue={editProduct['KM driven'] || null} onChange={handleProductInfoChange} required />
                                </div>
                            </div>

                            : editProduct.subcategory === 'Bicycles' ?
                                <div className="input-section">
                                    <div className="input-field">
                                        <label htmlFor="">Brand</label>
                                        <input type="text" minLength={2} maxLength={70} name='Brand' defaultValue={editProduct.Brand || null} onChange={handleProductInfoChange} required />
                                    </div>
                                </div>

                                : editProduct?.category === 'Mobiles' ?
                                    <div className="input-section">
                                        <div className="input-field">
                                            <label htmlFor="">Brand</label>
                                            <input type="text" minLength={2} maxLength={70} name='Brand' defaultValue={editProduct.Brand || null} onChange={handleProductInfoChange} required />
                                        </div>
                                    </div>
                                    : ''
                    }


                    <div className="input-section">
                        <div className="input-field">
                            <label htmlFor="">Ad title</label>
                            <input type="text" minLength={5} maxLength={70} name='ad-title' defaultValue={editProduct['ad-title'] || null} onChange={handleProductInfoChange} required />
                            <p>Mention the key features of your item (e.g. brand, model, age, type)</p>
                        </div>

                        <div className="input-field">
                            <label htmlFor="">Description</label>
                            <textarea type="text" minLength={10} maxLength={4096} name='description' defaultValue={editProduct?.description || null} onChange={handleProductInfoChange} required />
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
                                    defaultValue={editProduct.price}
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
                                    disabled={changed?.imgURLs?.length >= 12} />

                                {images?.length < 12 &&
                                    <img src={ImageIcon} className="image-item add-photo" onClick={() => imageInputRef.current?.click()} alt="" />}

                                {images?.map((img, index) => {
                                    return (
                                        <div key={index} className={coverImage === img ? "image-item cover" : "image-item"} >
                                            <img src={img instanceof File ? URL.createObjectURL(img) : img} alt="item-image" />
                                            <p onClick={() => setCoverImage(img)}> {coverImage === img ? 'Cover Image' : 'Set as Cover'}</p>
                                            <i className="fa-solid fa-xmark" onClick={() => handleDeleteImage(img)}></i>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>

                    <div className="input-section">
                        <h4>MODIFY YOUR LOCATION</h4>

                        <div className="input-field">
                            <label htmlFor="">State</label>
                            <input type="text" minLength={5} maxLength={70}
                                value={changed?.sellerInfo?.state}
                                onChange={handleSellerInfoChange}
                                name='state' required />
                        </div>
                        <div className="input-field">
                            <label htmlFor="">District</label>
                            <input type="text" minLength={5} maxLength={70}
                                value={changed?.sellerInfo?.district}
                                onChange={handleSellerInfoChange}
                                name='district' required />
                        </div>
                        <div className="input-field">
                            <label htmlFor="">Neighbourhood</label>
                            <input type="text" minLength={5} maxLength={70}
                                value={changed?.sellerInfo?.neighbourhood}
                                onChange={handleSellerInfoChange}
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
                                    onChange={handleSellerPhotoChange} />

                                <img src={changed?.sellerInfo.photo instanceof File ? URL.createObjectURL(changed?.sellerInfo?.photo) : changed?.sellerInfo?.photo || "https://img.icons8.com/?size=100&id=65342&format=png&color=000000"} onClick={() => profileInputRef.current?.click()} alt="" />

                                <div className="name-input input-field">
                                    <label htmlFor="">Name</label>
                                    <input type="text" defaultValue={changed?.sellerInfo.name} minLength={3} maxLength={70} onChange={handleSellerInfoChange} required />
                                </div>
                            </div>

                            <div className="phone">
                                <p>Phone number</p>
                                <div className='phone-input'>
                                    <span>+91</span>
                                    <input type="tel"
                                        maxLength="10"
                                        minLength="10"
                                        pattern="\d{10}"
                                        value={changed?.sellerInfo?.phone}
                                        prefix='+91'
                                        onChange={handleSellerInfoChange}
                                        name='phone'
                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10)}
                                        required />
                                </div>
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

export default ItemEditForm
