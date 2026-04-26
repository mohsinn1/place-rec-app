import { useState, useEffect } from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function PlacesList({ selectedMood, position }) {
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!selectedMood || !position) {
            return;
        }
        setIsLoading(true);
        fetch(`${API_BASE}/api/places/nearby/?mood=${selectedMood}&lat=${position[0]}&lng=${position[1]}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPlaces(data);
                } else {
                    console.error("Backend Error:", data.error);
                    setPlaces([]); // Clear the list if there's an error!
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setIsLoading(false);
                setPlaces([]);
            });
    }, [selectedMood, position])

    return (
        <div className="places-list">
            {isLoading ? (
                // Render skeleton cards while loading
                [...Array(4)].map((_, index) => (
                    <div className="place-card" style={{ cursor: 'default' }} key={`skeleton-${index}`}>
                        <SkeletonTheme baseColor="#2a2a40" highlightColor="#3a3a5a">
                            <div style={{ width: '50%', marginBottom: '16px' }}>
                                <Skeleton height={24} borderRadius={12} />
                            </div>
                            <div className="place-info">
                                {[1, 2, 3].map(i => (
                                    <div className="info-row" key={i}>
                                        <Skeleton width={80} height={16} />
                                        <Skeleton width={100} height={16} />
                                    </div>
                                ))}
                            </div>
                        </SkeletonTheme>
                    </div>
                ))
            ) : (
                // Render actual places
                places.map(place => (
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
                ))
            )}
        </div>
    );
}

export default PlacesList;