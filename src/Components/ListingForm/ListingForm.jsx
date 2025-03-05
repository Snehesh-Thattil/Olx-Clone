import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../../Firebase/firbase-config'
import ImageIcon from '../../Assets/Images/image-upload-icon.png'
import './ListingForm.css'
import axios from 'axios'

function ListingForm() {
    const [fields, setFields] = useState([])
    const [images, setImages] = useState([])
    const [coverImage, setCoverImage] = useState()
    const [userLocation, setUserLocation] = useState({
        state: '',
        district: '',
        neighbourhood: ''
    })
    const location = useLocation()
    const navigate = useNavigate()
    const form = location.state?.subctgry || "unknown"

    const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

    let fbFormName = null;
    switch (form) {
        case 'Cars': fbFormName = 'car_form'; break;
        case 'Accessories': fbFormName = 'accessories_form'; break;
        case 'Mobile Phones': fbFormName = 'mobilePhone_form'; break;
        case 'Tablets': fbFormName = 'tablet_form'; break;
        case 'Scooters': fbFormName = 'scooter_form'; break;
        case 'Motorcycles': fbFormName = 'motorcycle_form'; break;
        case 'Bicycles': fbFormName = 'bicycle_form'; break;
        case 'Commercial & Other Vehicles': fbFormName = 'vehicles_form'; break;
        case 'Vehicle Spares': fbFormName = 'spares_form'; break;
        default: fbFormName = null;
    }

    // Fetch template of inputs of selected subcategory
    useEffect(() => {
        const fetchForm = async () => {
            try {
                const docRef = doc(db, "formTemplates", fbFormName)
                const res = await getDoc(docRef)
                const data = res.data().fields

                if (res.exists()) {
                    setFields(data)
                } else {
                    console.log("No such document!")
                }
            } catch (err) {
                console.log("Error fetching formDoc", err.message)
            }
        }
        fetchForm()
    }, [fbFormName])

    // Handle image input field change
    function handleUploadChange(e) {
        const files = Array.from(e.target.files)

        if (images.length + files.length > 12) {
            alert("You can only upload up to 12 images.")
            return
        }

        setImages((prevImages) => [...prevImages, ...files])

        if (!coverImage) {
            setCoverImage(files[0])
        }
    }

    // Fetch location of the user
    useEffect(() => {
        const fetchUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords

                    const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`)
                    const addressComponents = data.results[0].address_components

                    const state = await addressComponents?.find((comp) => comp.types.includes("administrative_area_level_1"))?.long_name
                    const district = await addressComponents?.find((comp) => comp.types.includes("administrative_area_level_3"))?.long_name
                    const neighbourhood = await addressComponents?.find((comp) => comp.types.includes("sublocality") || comp.types.includes("neighborhood") || comp.types.includes("locality"))?.long_name

                    setUserLocation({ state: state, district: district, neighbourhood: neighbourhood })
                })
            }
        }
        fetchUserLocation()
    }, [GOOGLE_API_KEY])

    // Handle change address manually
    function handleLocationChange(e) {
        setUserLocation({ ...userLocation, [e.target.name]: e.target.value })
    }

    // Handle delete image icon click
    function handleDeleteImage(img) {
        setImages((prevImages) => {
            const newImgArray = prevImages.filter((prevImg) => prevImg !== img)

            if (!newImgArray.includes(coverImage)) {
                setCoverImage(newImgArray.length > 0 ? newImgArray[0] : null)
            }
            return newImgArray
        })
    }

    // JSX
    return (
        <div className='Listing'>
            <div className="navigate">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
                <p>Post Your Ad</p>
            </div>
            <div className="details">
                <h3>INCLUDE SOME DETAILS</h3>
                <form action="">

                    <div className="input-section">
                        {fields.map((field, index) => {
                            return (
                                <div className="input-field" key={index}>
                                    <label htmlFor="">{field.label}</label>

                                    {field.type === 'radio' ? (
                                        <div className="radios">
                                            {field.options.map((opt, index) => (
                                                <label key={index}>
                                                    <input type="radio" name={field.label} value={opt} required /> {opt}
                                                </label>
                                            ))}
                                        </div>

                                    ) : (<input min={field.min} max={field.max} minLength={field.minLength} maxLength={field.maxLength} type={field.type} required />)
                                    }
                                </div>
                            )
                        })}

                        <div className="input-field">
                            <label htmlFor="">Ad title</label>
                            <input type="text" minLength={5} maxLength={70} required />
                            <p>Mention the key features of your item (e.g. brand, model, age, type)</p>
                        </div>

                        <div className="input-field">
                            <label htmlFor="">Description</label>
                            <textarea type="text" minLength={10} maxLength={4096} required />
                            <p>Include condition, features and reason for selling</p>
                        </div>
                    </div>

                    <div className="input-section">
                        <h4>SET A PRICE</h4>
                        <div className="input-field price-input">
                            <label htmlFor="">Price</label>

                            <div className="price-input-wrapper">
                                <span className="currency-symbol">₹</span>
                                <input type="number" id="price" min={10} max={999999999} required />
                            </div>
                        </div>
                    </div>

                    <div className="input-section">
                        <h4>UPLOAD UP TO 12 PHOTOS</h4>
                        <div className="input-field">

                            <div className="images-grid">
                                <input style={{ display: 'none' }} id='input-image' type="file" multiple onChange={handleUploadChange} accept='image/*' disabled={images.length >= 12} />

                                {images.length < 12 &&
                                    <img src={ImageIcon} className="image-item add-photo" onClick={() => document.getElementById('input-image').click()} alt="" />}

                                {images.map((img, index) => {
                                    return (
                                        <div key={index} className={coverImage === img ? "image-item cover" : "image-item"} >
                                            <img src={URL.createObjectURL(img)} alt="item-image" onClick={() => setCoverImage(img)} />
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
                                value={userLocation?.state}
                                onChange={handleLocationChange}
                                name='state' required />
                        </div>
                        <div className="input-field">
                            <label htmlFor="">District</label>
                            <input type="text" minLength={5} maxLength={70}
                                value={userLocation?.district}
                                onChange={handleLocationChange}
                                name='district' required />
                        </div>
                        <div className="input-field">
                            <label htmlFor="">Neighbourhood</label>
                            <input type="text" minLength={5} maxLength={70}
                                value={userLocation?.neighbourhood}
                                onChange={handleLocationChange}
                                name='neighbourhood' required />
                        </div>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default ListingForm
