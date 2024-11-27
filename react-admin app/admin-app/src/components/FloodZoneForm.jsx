import React, { useState } from "react";
import axios from "axios";

const FloodZoneForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        coordinates: [0, 0], // Default: latitude and longitude
        address: "",
        riskLevel: "Low",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "latitude" || name === "longitude") {
            const coordinates = [...formData.coordinates];
            coordinates[name === "latitude" ? 0 : 1] = parseFloat(value);
            setFormData({ ...formData, coordinates });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/flood-zones", {
                name: formData.name,
                location: {
                    coordinates: formData.coordinates,
                    address: formData.address,
                },
                riskLevel: formData.riskLevel,
            });
            alert("Flood Zone Added: " + response.data.message);
        } catch (error) {
            alert("Error: " + error.response?.data?.error || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Latitude:</label>
                <input
                    type="number"
                    name="latitude"
                    value={formData.coordinates[0]}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Longitude:</label>
                <input
                    type="number"
                    name="longitude"
                    value={formData.coordinates[1]}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Risk Level:</label>
                <select
                    name="riskLevel"
                    value={formData.riskLevel}
                    onChange={handleChange}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <button type="submit">Add Flood Zone</button>
        </form>
    );
};

export default FloodZoneForm;
