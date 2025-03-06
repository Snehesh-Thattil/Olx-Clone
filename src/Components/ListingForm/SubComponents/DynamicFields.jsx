import React from 'react'

function DynamicFields({ fields, onChange }) {
    return (
        <div className="input-section">
            {fields.map((field, index) => {
                return (
                    <div className="input-field" key={index}>
                        <label htmlFor="">{field.label}</label>

                        {field.type === 'radio' ? (
                            <div className="radios">
                                {field.options.map((opt, index) => (
                                    <label key={index}>
                                        <input type="radio"
                                            required
                                            value={opt}
                                            name={field.label}
                                            onChange={onChange}
                                        /> {opt}
                                    </label>
                                ))}
                            </div>

                        ) : (<input type={field.type}
                            min={field.min} max={field.max}
                            minLength={field.minLength}
                            maxLength={field.maxLength}
                            onChange={onChange}
                            name={field.label} required />)
                        }
                    </div>
                )
            })
            }
        </div>
    )
}

export default DynamicFields
