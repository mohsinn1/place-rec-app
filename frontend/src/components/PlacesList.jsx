import { useState, useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function PlacesList({ selectedMood, position }) {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        if (!selectedMood || !position) {
            return;
        }
        fetch(`${API_BASE}/api/places/nearby/?mood=${selectedMood}&lat=${position[0]}&lng=${position[1]}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPlaces(data);
                } else {
                    console.error("Backend Error:", data.error);
                    setPlaces([]); // Clear the list if there's an error!
                }
            })
    }, [selectedMood, position])

    return (
        <div className="places-list">
            {places.map(place => (
                <div className='place-card' key={place.id}>
                    <h3 className='place-name'>{place.name}</h3>
                    <div className='place-info'>
                        <div className='info-row'>
                            <span className='info-label'>Distance</span>
                            <span className='info-value'>{place.distance} km</span>
                        </div>
                        <div className='info-row'>
                            <span className='info-label'>Type</span>
                            <span className='info-value'>{place.type}</span>
                        </div>
                        <div className='info-row'>
                            <span className='info-label'>Address</span>
                            <span className='info-value'>{place.address}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PlacesList;