import React from 'react';
import Header from '../Components/Header/Header';
import Posts from '../Components/Posts/Posts';
import Footer from '../Components/Footer/Footer';
import Categories from '../Components/Categories/Categories';

function Home() {
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

