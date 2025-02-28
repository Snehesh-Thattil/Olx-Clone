import React, { useEffect } from 'react'
import './Loader.css'

function Loader() {
    useEffect(() => {
        document.body.style.overflow = 'hidden' // Disable scrolling when loader mounts
        return () => {
            document.body.style.overflow = 'auto' // Enable scrolling when loader unmounts
        }
    }, [])

    // Rendering Loader
    return (
        <div className="loader">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="#CB0000" stroke="#CB0000" strokeWidth="15" width="30" height="30" x="25" y="50"><animate attributeName="y" calcMode="spline" dur="2" values="50;120;50;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></rect><rect fill="#CB0000" stroke="#CB0000" strokeWidth="15" width="30" height="30" x="85" y="50"><animate attributeName="y" calcMode="spline" dur="2" values="50;120;50;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></rect><rect fill="#CB0000" stroke="#CB0000" strokeWidth="15" width="30" height="30" x="145" y="50"><animate attributeName="y" calcMode="spline" dur="2" values="50;120;50;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></rect></svg>
        </div>
    )
}

export default Loader
