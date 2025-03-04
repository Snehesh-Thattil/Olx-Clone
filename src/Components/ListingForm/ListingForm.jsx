import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../../Firebase/firbase-config'
import './ListingForm.css'

function ListingForm() {
    const location = useLocation()
    const navigate = useNavigate()
    const form = location.state?.subctgry || "unknown"

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

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const docRef = doc(db, "formTemplates", fbFormName);
                const res = await getDoc(docRef)

                if (res.exists()) {
                    console.log("Form Data:", res.data().fields);
                } else {
                    console.log("No such document!");
                }
            } catch (err) {
                console.log("Error fetching formDoc", err.message)
            }
        }
        fetchForm()
    }, [fbFormName])


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
                        <div className="input-field">
                            <label htmlFor="">Ad title</label>
                            <input type="text" />
                            <p>Mention the key features of your item (e.g. brand, model, age, type)</p>
                        </div>

                        <div className="input-field">
                            <label htmlFor="">Description</label>
                            <textarea type="text" maxLength={4096} minLength={10} />
                            <p>Include condition, features and reason for selling</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ListingForm
