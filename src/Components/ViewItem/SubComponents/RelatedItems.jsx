import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../Posts/Posts.css'

function RelatedItems({ products }) {
    const navigate = useNavigate()

    // Format the date of product listing
    const formatDate = useCallback((createdAt) => {
        const createdDate = new Date(createdAt.seconds * 1000).toLocaleDateString()
        const today = new Date().toLocaleDateString()
        const findYesterday = new Date()
        findYesterday.setDate(findYesterday.getDate() - 1)
        const yesterday = findYesterday.toLocaleDateString()

        if (createdDate === today) {
            return "Today"
        }
        else if (createdDate === yesterday) {
            return "Yesterday"
        }
        else {
            return createdDate
        }
    }, [])

    // JSX
    return (
        <div className="related-items Posts">
            <div className="heading">
                <span>Similar Items</span>
            </div>
            <div className="cards">
                {products?.map((product, index) => {
                    return (
                        <div className="card" key={index} onClick={() => {
                            navigate('/view', { state: { product, formatDate: formatDate(product.createdAt) } })
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }}>
                            <div className="image">
                                <img src={product.coverImgURL} alt="product-image" />
                            </div>

                            <div className="content">
                                <h2 className="rate">&#x20B9; {product.price}</h2>
                                {['Car', 'Scooters', 'Motorcycles', 'Commercial & Other Vehicles']
                                    .includes(product.category) ?
                                    <span className="kilometer">{product.Year} - {product["KM driven"]}km</span> : ""}
                                <p className="name"> {product['ad-title']}</p>
                            </div>

                            <div className="place-date">
                                <p className='place'>{product.neighbourhood}, {product.state}</p>
                                <p className='date'>{formatDate(product.createdAt)}
                                </p>
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RelatedItems
