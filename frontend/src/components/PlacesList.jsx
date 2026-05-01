import { useState, useEffect } from "react";
import { LuMapPin, LuArrowDownAZ, LuPlus } from "react-icons/lu";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';

function PlacesList({ selectedMood, position }) {
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sort, setSort] = useState('distance')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isFetchingMore, setIsFetchingMore] = useState(false)


    // Reset page to 1 when mood or location changes
    useEffect(() => {
        setPage(1);
        setHasMore(true);
    }, [selectedMood, position]);

    // Main fetcher
    useEffect(() => {
        if (!selectedMood || !position) return;

        const controller = new AbortController();
        
        if (page === 1) {
            setIsLoading(true);
            setPlaces([]); // Clear list visually for new mood
        } else {
            setIsFetchingMore(true);
        }

        fetch(`${API_BASE}/api/places/nearby/?mood=${selectedMood}&lat=${position[0]}&lng=${position[1]}&page=${page}&limit=4`, {
            signal: controller.signal
        })
            .then(res => res.json())
            .then(data => {
                if (data.places) {
                    setHasMore(data.has_more);
                    // REPLACE on page 1, APPEND on page > 1
                    setPlaces(prev => page === 1 ? data.places : [...prev, ...data.places]);
                }
                setIsLoading(false);
                setIsFetchingMore(false);
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error("Fetch Error:", err);
                setIsLoading(false);
                setIsFetchingMore(false);
            });

        return () => controller.abort();
    }, [selectedMood, position, page]);


    const sorted_places = [...places].sort((a, b) => sort === 'alphabetical' ? a.name.localeCompare(b.name) : a.distance - b.distance)

    return (
        <>
            {!isLoading && places.length > 0 && <div className="sort-btns">

                <button
                    className={sort === 'distance' ? 'sort-btn-active' : 'sort-btn'}
                    onClick={() => setSort('distance')}><LuMapPin size={18} /> Distance
                </button>


                <button
                    className={sort === 'alphabetical' ? 'sort-btn-active' : 'sort-btn'}
                    onClick={() => setSort('alphabetical')}><LuArrowDownAZ size={18} />Alphabetical</button>
            </div>}

            <div className="places-list">
                {
                    isLoading ? (
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
                        sorted_places.map(place => (
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
                    )
                }
            </div >

            {hasMore && !isLoading && places.length > 0 && (
                <div className="load-more-container">
                    <button 
                        className="load-more-btn" 
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={isFetchingMore}
                    >
                        {isFetchingMore ? (
                            "Loading..."
                        ) : (
                            <>
                                <LuPlus size={18} />
                                Load More
                            </>
                        )}
                    </button>
                </div>
            )}
        </>
    );
}

export default PlacesList;