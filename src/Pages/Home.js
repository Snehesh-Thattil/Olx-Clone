import React, { useContext, useEffect, useState } from 'react';
import Header from '../Components/Header/Header';
import Posts from '../Components/Posts/Posts';
import Footer from '../Components/Footer/Footer';
import Categories from '../Components/Categories/Categories';
import { AuthContext } from '../Store/AuthContext';

function Home() {
  const { user } = useContext(AuthContext)
  const [search, setSearch] = useState({ product: '', place: '' })

  // Fetch user location when user changes
  useEffect(() => {
    const newPlace = user?.district && user?.state ? `${user.district}, ${user.state}` : ''
    setSearch((prev) => (prev.place !== newPlace ? { ...prev, place: newPlace } : prev))
  }, [user])

  return (
    <div className="homeParentDiv">
      <Header search={search} setSearch={setSearch} />
      <Categories setSearch={setSearch} />
      <Posts search={search} setSearch={setSearch} />
      <Footer />
    </div>
  )
}

export default Home;

