import React from 'react';

import './Footer.css';

function Footer() {
  return (
    <div className="Footer">
      <div className="links">
        <div className="popular-loc">
          <h3>Popular Locations</h3>
          <a href="https://www.olx.in/en-in/kolkata_g4157275">Kolkata</a>
          <a href="https://www.olx.in/en-in/mumbai_g4058997">Mumbai</a>
          <a href="https://www.olx.in/en-in/chennai_g4059162">Chennai</a>
          <a href="https://www.olx.in/en-in/pune_g4059014">Pune</a>
        </div>
        <div className="trending-loc">
          <h3>Trending Locations</h3>
          <a href="https://www.olx.in/en-in/bhubaneshwar_g4059049">Bhubaneshwar</a>
          <a href="https://www.olx.in/en-in/hyderabad_g4058526">Hyderabad</a>
          <a href="https://www.olx.in/en-in/chandigarh_g4058651">Chandigarh</a>
          <a href="https://www.olx.in/en-in/nashik_g4059002">Nashik</a>
        </div>
        <div className="about">
          <h3>ABOUT US</h3>
          <a href="https://tech.olx.in/">Tech@OLX</a>
        </div>
        <div className="olx-links">
          <h3>OLX</h3>
          <a href="https://www.olx.in/blog">blog</a>
          <a href="https://help.olx.in/hc/en-us">Help</a>
          <a href="https://www.olx.in/en-in/sitemap/most-popular">Sitemap</a>
          <a href="https://help.olx.in/hc/en-us/categories/10781706981149-Legal-Privacy-information">Legal & Privacy information</a>
          <a href="https://bugbase.ai/programs/olx">Vulnarability Disclosure Program</a>
        </div>
        <div className="follow-us">
          <h3>FOLLOW US</h3>
          <div className="icons">
            <a href="https://www.facebook.com/olxindia/"><i className="fa-brands fa-facebook"></i></a>
            <a href="https://www.instagram.com/olx_india/"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://twitter.com/OLX_India"><i className="fa-brands fa-twitter"></i></a>
            <a href="https://www.youtube.com/user/OLXInTv"><i className="fa-solid fa-circle-play"></i></a>
          </div>
          <div className="store">
            <a href="https://play.google.com/store/apps/details?id=com.olx.southasia"><img src="https://b.zmtcdn.com/data/webuikit/9f0c85a5e33adb783fa0aef667075f9e1556003622.png" alt="" /></a>
            <a href="https://itunes.apple.com/in/app/olx-buy-sell-near-you/id913492792?mt=8"><img src="https://b.zmtcdn.com/data/webuikit/23e930757c3df49840c482a8638bf5c31556001144.png" alt="" /></a>
          </div>
        </div>
      </div>
      <div className="subsidiaries">
        <div className="logos">
          <a href="/"><img src="https://statics.olx.in/external/base/img/cartrade/logo/cartrade_tech.svg?v=1" alt="" /></a>
          <div className="hr-line"></div>
          <a href="/"><img src="https://statics.olx.in/external/base/img/cartrade/logo/olx.svg?v=1" alt="" /></a>
          <a href="https://www.carwale.com/"><img src="https://statics.olx.in/external/base/img/cartrade/logo/carwale.svg?v=1" alt="" /></a>
          <a href="https://www.bikewale.com/"><img src="https://statics.olx.in/external/base/img/cartrade/logo/bikewale.svg?v=1" alt="" /></a>
          <a href="https://www.cartrade.com/"><img src="https://statics.olx.in/external/base/img/cartrade/logo/cartrade.svg?v=1" alt="" /></a>
          <a href="https://www.mobilityoutlook.com/"><img src="https://statics.olx.in/external/base/img/cartrade/logo/mobility.svg?v=1" alt="" /></a>
        </div>

        <div className="help">
          <a href="https://www.olx.in/en-in/sitemap/most-popular">Help - Sitemap</a>
          <p>All rights reserved © 2006-2025 OLX</p>
        </div>
      </div>
    </div>
  )
}

export default Footer;
