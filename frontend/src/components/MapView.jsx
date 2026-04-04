import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function MapView({ position, error }) {
    if (error) {
        return <div className="map-error">Location error: {error}</div>
    }

    if (!position) {
        return <div className="map-loading">Loading map...</div>
    }

    return (
        <MapContainer className='map' center={position} zoom={15} scrollWheelZoom={false} style={{ height: '200px', width: '60%', borderRadius: '20px', marginTop: '20px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
                <Popup>You are here!</Popup>
            </Marker>
        </MapContainer>
    )
}

export default MapView