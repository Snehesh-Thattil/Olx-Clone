import React, { useState } from "react";
import "./PostAd.css";
import { useNavigate } from "react-router-dom";

const categories = [
    { name: "Cars", subcategories: ["Cars"] },
    { name: "Mobiles", subcategories: ["Mobile Phones", "Accessories", "Tablets"] },
    { name: "Bikes", subcategories: ["Motorcycles", "Scooters", "Spare Parts", "Bycicles"] },
    { name: "Furniture", subcategories: ["Sofa & Dining", "Beds & Wardrobes", "Home Decor & Garden", "Kids Furniture", "Other Household Items"] },
    { name: "Fashion", subcategories: ["Men", "Women", "Kids"] },
    { name: "Electronics", subcategories: ["TVs Video - Audio", "Kitchen & Other Appliances", "Computers & Laptops, Accessories", "Cameras & Lenses", "Hard Disks, Printers & Monitors", "Games & Entertainment", "Fridges", "Washing Machines", "ACs"] },
    { name: "Vehicles & Spares", subcategories: ["Commercial & Other Vehicles", "Spare Parts"] },
    { name: "Sports", subcategories: ["Gym & Fitness", "Books", "Sports equipments", "Musical Instruments"] },
]

function PostAd() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate()

    // JSX
    return (
        <div className="PostAd">
            <div className="navigate">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate('/')}></i>
                <p>Post Your Ad</p>
            </div>
            <div className="category-box">

                <div className="category-header">
                    <h2 >POST YOUR AD</h2>
                    <h4>CHOOSE A CATEGORY</h4>
                </div>

                <div className="lists">
                    <ul className="category-list">
                        {categories.map((category, index) => {
                            return (
                                <li key={index} className={category?.name === selectedCategory?.name ? 'active' : ''}
                                    onClick={() => setSelectedCategory(category)}>
                                    {category?.name}<span className="arrow">&#8250;</span>
                                </li>
                            )
                        })}
                    </ul>

                    {selectedCategory &&
                        <ul className="subcategory-list">
                            {selectedCategory.subcategories.map((subcats, index) => (
                                <li key={index}>
                                    {subcats}
                                </li>
                            ))}
                        </ul>}
                </div>

            </div>
        </div>
    );
}

export default PostAd