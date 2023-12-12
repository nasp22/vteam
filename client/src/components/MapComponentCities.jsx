// src/components/MapComponentCities.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as L from 'leaflet';
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useAuth0 } from '@auth0/auth0-react';

const CityMarkerIcon = require('../assets/city_position.png');

const MapComponentCities = () => {
  const [positions] = React.useState([
    { id: 1, lat: 59.32569, lng: 18.05277, content: 'Stockholm' },
    { id: 2, lat: 57.698781, lng: 12.021345, content: 'Göteborg' },
    { id: 3, lat: 55.57143, lng: 13.01066, content: 'Malmö' },
    // ... lägg till fler positioner här
  ]);

  const history = useHistory();
  const { user, isAuthenticated } = useAuth0();

  const handleMarkerClick = (id) => {
    // Navigera till CityDetailsView med hjälp av react-router-dom
    history.push(`/city-details/${id}`);
  };

  const customMarker = new L.Icon({
    iconUrl: CityMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <>
      {isAuthenticated && user.name === 'admin@vteam.se' ? (
        <MapContainer center={[59.075700, 14.742024]} zoom={5} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {positions.map((position) => (
            <Marker
              icon={customMarker}
              key={position.id}
              position={[position.lat, position.lng]}
              draggable={false}
              onClick={() => handleMarkerClick(position.id)}
            >
              <Popup>{position.content}</Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Ej inloggad som admin, kan ej visa karta över städer </p>
      )}
    </>
  );
};

export default MapComponentCities;
