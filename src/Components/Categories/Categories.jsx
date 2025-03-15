import React from "react"
import "./Categories.css"

function Categories({ setSearch }) {
    
    // Handle selection of a category
    const handleSelect = (e) => {
        const category = e.currentTarget.textContent.trim()
        setSearch(prev => ({ ...prev, product: category }))
    }

    // JSX
    return (
        <div className="Categories">
            <div className="banner">
                <img src="../../../Images/banner copy.png" alt="Banner" />
            </div>
            <ul className="icons">
                {[{ name: "Mobiles", icon: "yL8eNVNhjNED" },
                { name: "Cars", icon: "fsoiqMUp0O4v" },
                { name: "Bikes", icon: "cUnsXrpRV0dh" },
                { name: "Fashion", icon: "16596" },
                { name: "Vehicles & Spares", icon: "15196" },
                { name: "Furnitures", icon: "Y4whzjEgpgTq" },
                { name: "Electronics", icon: "rK2oMG5aqqyK" },
                { name: "Sports & Books", icon: "lUk0RmiULLry" }].map((item, index) => (
                    <li key={index} onClick={handleSelect}>
                        <img src={`https://img.icons8.com/?size=100&id=${item.icon}&format=png&color=000000`} alt={item.name} />
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Categories