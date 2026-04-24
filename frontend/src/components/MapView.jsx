import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Setup the default icon for Leaflet
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;


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