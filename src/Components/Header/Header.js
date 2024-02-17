import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import OlxLogo from '../../assets/OlxLogo';
import Search from '../../assets/Search';
import Arrow from '../../assets/Arrow';
import SellButton from '../../assets/SellButton';
import SellButtonPlus from '../../assets/SellButtonPlus';
import { AuthContext, FirebaseContext } from '../../Store/ContextFiles'

function Header() {
  const { User } = useContext(AuthContext)
  const { Firebase } = useContext(FirebaseContext)
  const navigate = useNavigate()

  return (
    <div className="headerParentDiv"> 
      <div className="headerChildDiv">

        <div onClick={() => navigate('/')} className="brandName">
          <OlxLogo></OlxLogo>
        </div>

        <div className="placeSearch">
          <Search></Search>
          <input type="text" />
          <Arrow></Arrow>
        </div>

        <div className="productSearch">
          <div className="input">
            <input
              type="text"
              placeholder="Find car,mobile phone and more..."
            />
          </div>

          <div className="searchAction">
            <Search color="#ffffff"></Search>
          </div>
        </div>

        <div className="language">
          <span> ENGLISH </span>
          <Arrow></Arrow>
        </div>

        <div className="loginPage">
          <span> {User ? User.displayName : <a href='/login'>Login</a> }</span>
          <hr />
        </div>

        <div className="logoutPage">
          <span onClick={() => {
            Firebase.auth().signOut().then(() => {
              navigate('/logout')
            })
          }}>{User ? 'Logout' : ''}</span>
        </div>

        <div className="sellMenu">
          <SellButton></SellButton>
          <div className="sellMenuContent">
            <SellButtonPlus></SellButtonPlus>
            <span onClick={() => navigate('/create')}>SELL</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Header;
