import React, { useContext, useEffect } from 'react'
import Header from '../Components/Header/Header'
import Posts from '../Components/Posts/Posts'
import Footer from '../Components/Footer/Footer'
import Categories from '../Components/Categories/Categories'
import { AuthContext } from '../Store/AuthContext'
import { SearchContext } from '../Store/SearchContext'

function Home() {
  const { user } = useContext(AuthContext)
  const { setSearch } = useContext(SearchContext)

  // Fetch user location when user changes
  useEffect(() => {
    const newPlace = user?.district && user?.state ? `${user.district}, ${user.state}` : ''
    setSearch((prev) => (prev.place !== newPlace ? { ...prev, place: newPlace } : prev))
  }, [setSearch, user])

  return (
    <div className="homeParentDiv">
      <Header />
      <Categories />
      <Posts />
      <Footer />
    </div>
  )
}

export default Home;

