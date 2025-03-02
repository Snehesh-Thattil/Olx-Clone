import React, { useState } from "react";
import "./PostAd.css";

const categories = [
    { name: "Cars", subcategories: ["Cars"] },
    { name: "Mobiles", subcategories: ["Mobile Phones", "Accessories", "Tablets"] },
    { name: "Bikes", subcategories: ["Motorcycles", "Scooters", "Spare Parts", "Bycicles"] },
    { name: "Electronics & Appliances", subcategories: ["TVs Video - Audio", "Kitchen & Other Appliances", "Computers & Laptops, Accessories", "Cameras & Lenses", "Hard Disks, Printers & Monitors", "Games & Entertainment", "Fridges", "Washing Machines", "ACs"] },
    { name: "Commercial Vehicles & Spares", subcategories: ["Commercial & Other Vehicles", "Spare Parts"] },
    { name: "Furniture", subcategories: ["Sofa & Dining", "Beds & Wardrobes", "Home Decor & Garden", "Kids Furniture", "Other Household Items"] },
    { name: "Fashion", subcategories: ["Men", "Women", "Kids"] },
]

function PostAd() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // JSX
    return (
        <div className="PostAd">
            <div className="category-box">

                <div className="category-header">
                    <h2 >POST YOUR AD</h2>
                    <h4>CHOOSE A CATEGORY</h4>
                </div>

                <div className="lists">
                    <ul className="category-list">
                        {categories.map((category, index) => {
                            return (
                                <li key={index} className="category-li">
                                    <button className="category-item" onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.subcategories)}>
                                        {category.name}
                                        {category.subcategories && <span className="arrow">&#8250;</span>}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>

                    {selectedCategory &&
                        <ul className="subcategory-list">
                            {selectedCategory.map((sub) => (
                                <li key={sub} className="subcategory-item">
                                    {sub}
                                </li>
                            ))}
                        </ul>}
                </div>

            </div>
        </div>
    );
}

export default PostAd