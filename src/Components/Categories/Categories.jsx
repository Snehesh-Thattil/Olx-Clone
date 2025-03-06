import React from 'react'
import './Categories.css'

function Categories() {

    // JSX
    return (
        <div className='Categories'>
            <div className="banner">
                <img src="../../../Images/banner copy.png" alt="" />
            </div>
            <div className="icons">
                <li><img src="https://img.icons8.com/?size=100&id=yL8eNVNhjNED&format=png&color=000000" alt="mobiles" />Mobiles</li>
                <li><img src="https://img.icons8.com/?size=100&id=fsoiqMUp0O4v&format=png&color=000000" alt="cars" />Cars</li>
                <li><img src="https://img.icons8.com/?size=100&id=cUnsXrpRV0dh&format=png&color=000000" alt="bikes" />Bikes</li>
                <li><img src="https://img.icons8.com/?size=100&id=16596&format=png&color=000000" alt="fashion" />Fashion</li>
                <li><img src="https://img.icons8.com/?size=100&id=15196&format=png&color=000000" alt="vehicles" />Vehicles & Spares</li>
                <li><img src="https://img.icons8.com/?size=100&id=Y4whzjEgpgTq&format=png&color=000000" alt="furnitures" />Furnitures</li>
                <li><img src="https://img.icons8.com/?size=100&id=rK2oMG5aqqyK&format=png&color=000000" alt="electronics" />Electronics</li>
                <li><img src="https://img.icons8.com/?size=100&id=lUk0RmiULLry&format=png&color=000000" alt="sports" />Sports & Books</li>
            </div>
        </div>

    )
}

export default Categories