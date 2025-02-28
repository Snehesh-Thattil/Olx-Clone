import React, { useCallback, useContext } from 'react';
import './Header.css';
import OlxLogo from '../../Assets/OlxLogo';
import Search from '../../Assets/Search';
import Arrow from '../../Assets/Arrow';
import SellButton from '../../Assets/SellButton';
import SellButtonPlus from '../../Assets/SellButtonPlus';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Store/ContextFiles'
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/firbase-config';

function Header() {
  const { User } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSignOut = useCallback(() => {
    signOut(auth)
      .then(() => console.log('signed out successfully'))
      .catch((err) => console.log("Error signing out:", err.message))
  }, [])

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
          {User ? <span>{User.displayName}</span> : <Link className='link' to='/login'>Login</Link>}
          <hr />
        </div>

        <div className="logoutPage">
          <span onClick={() => handleSignOut()}>{User ? 'Logout' : ''}</span>
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
