import './Posts.css'
import React, { useContext, useEffect, useMemo } from 'react'
import { ProductsContext } from '../../Store/ProductContext'
import { AuthContext } from '../../Store/AuthContext'
import { useNavigate } from 'react-router-dom'
import { db } from '../../Firebase/firebase-config'
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore'
import useDateFormat from '../../Hooks/useDateFormat'
import { LoginBoxContext } from '../../Store/LoginBoxContext'
import { SearchContext } from '../../Store/SearchContext'

function Posts({ MyWishlist, MyAdsList, title, fromProfile }) {
  const { products } = useContext(ProductsContext)
  const { setUser, user } = useContext(AuthContext)
  const { setLoginBox } = useContext(LoginBoxContext)
  const { search } = useContext(SearchContext)

  const navigate = useNavigate()
  const { formatDate } = useDateFormat()

  // Filter products on the basis of search
  const productsSearched = useMemo(() => {
    if (!search?.product && !search?.place) return products
    if (!products) return

    const productSearchKeywords = search.product.toLowerCase().split(" ")
    const placeSearchKeywords = search.place.toLowerCase().split(",").map((item) => item.trim())

    return [
      // Products that match all keywords
      ...products.filter((product) =>
        productSearchKeywords.every((word) =>
          `${product.Brand} ${product.Model} ${product.Variant} ${product.category} ${product.subcategory} ${product.Fuel}`
            .toLowerCase()
            .includes(word)
        )
      ),

      // Products that match at least one keyword (excluding already matched ones)
      ...products.filter((product) =>
        productSearchKeywords.some((word) =>
          `${product.Brand} ${product.Model} ${product.Variant} ${product.category} ${product.subcategory} ${product.Fuel}`
            .toLowerCase()
            .includes(word)
        ) &&
        !productSearchKeywords?.every((word) =>
          `${product.Brand} ${product.Model} ${product.Variant} ${product.category} ${product.subcategory} ${product.Fuel}`
            .toLowerCase()
            .includes(word)
        )
      )
    ].filter((item) => {
      return `${item.neighbourhood} ${item.district} ${item.state} ${item.country}`
        .toLowerCase()
        .includes(placeSearchKeywords[0])
    })
  }, [products, search])

  // Determine products to display
  const showProducts = useMemo(() => {
    if (MyWishlist) {
      return MyWishlist.length > 0 ? MyWishlist : []
    }
    else if (MyAdsList) {
      return MyAdsList.length > 0 ? MyAdsList : []
    }
    else {
      return productsSearched
    }
  }, [MyWishlist, MyAdsList, productsSearched])

  // Sort products before rendering
  const sortedProducts = useMemo(() => {
    return showProducts?.sort((a, b) => new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds))
  }, [showProducts])

  // Fetch user wishlist
  useEffect(() => {
    if (!user?.uid) return

    const fetchWishlist = async () => {
      try {
        const q = query(collection(db, "users"), where('id', '==', user?.uid))
        const docSnapshot = await getDocs(q)

        if (!docSnapshot.empty) {
          const wishlist = docSnapshot.docs[0].data().wishlist || []
          setUser(prev => ({ ...prev, wishlist }))
        }
      }
      catch (err) {
        console.error("Error Fetching Wishlsits", err.message)
      }
    }
    fetchWishlist()
  }, [setUser, user?.uid])

  // Handle wishlist toggle
  const handleWishlistToggle = async (e, product) => {
    e.stopPropagation()
    if (!user?.uid) return setLoginBox('Sign-up')

    try {
      const q = query(collection(db, "users"), where('id', '==', user.uid))
      const docSnapshot = await getDocs(q)

      if (docSnapshot.empty) return console.error("User document not found.")

      const docRef = docSnapshot.docs[0].ref
      const existingWishlist = docSnapshot.docs[0].data().wishlist || []

      let updatedWishlist = []

      if (existingWishlist.some((item) => item.id === product.id)) {
        updatedWishlist = existingWishlist.filter((wishlistProduct) => wishlistProduct.id !== product.id)
      } else {
        updatedWishlist = [...existingWishlist, product]
      }

      await updateDoc(docRef, { wishlist: updatedWishlist })
      setUser((prev) => ({ ...prev, wishlist: updatedWishlist }))
    }
    catch (err) {
      console.error("Error Updating wishlist :", err.message)
    }
  }

  // JSX
  return (
    <div className={fromProfile ? "Posts fromProfile" : "Posts"}>
      <div className="heading">
        <span>
          {title ? title
            : search?.product && sortedProducts?.length !== 0 ? 'Search Results'
              : search?.product && sortedProducts?.length === 0 ? 'Oops! Its empty, Try something else'
                : 'Fresh recommendations'}
        </span>
      </div>

      <div className="cards">
        {sortedProducts?.map((product, index) => {
          return (
            <div className="card" key={index} onClick={() => {
              navigate('/view', { state: { product } })
            }}>

              {!MyAdsList &&
                <i className={`fa-solid fa-heart ${user?.wishlist?.some((item) => item.id === product.id) ? "included" : ""}`}
                  onClick={(e) => handleWishlistToggle(e, product)}></i>}

              <div className="image">
                <img src={product.coverImgURL} alt="product-image" />
              </div>

              <div className="content">
                <h2 className="rate">&#x20B9; {product.price}</h2>
                {['Cars', 'Scooters', 'Motorcycles', 'Commercial & Other Vehicles']
                  .includes(product.category) && (
                    <p className="kilometer">{product.Year} - {product["KM driven"]}km</p>
                  )}
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

export default Posts