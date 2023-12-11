import React, { useState } from 'react';
import * as L from "leaflet"
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useAuth0 } from "@auth0/auth0-react";

const CityMarkerIcon = require('../assets/city_position.png')

const MapComponentStations = () => {
  const [positions, setPositions] = useState([
    // GET staions, enter position and name below, 'id', 'position[0]', 'position[1]', 'name'
    { id: 1, lat: 59.32569, lng: 18.05277, content: 'Stockholm' },
    { id: 2, lat: 57.698781, lng: 12.021345, content: 'Göteborg' },
    { id: 3, lat: 55.57143, lng: 13.01066, content: 'Malmö' },
    // ... lägg till fler positioner här
  ]);

  const handleMarkerDragEnd = (index, event) => {
    const { lat, lng } = event.target.getLatLng();
    const newPositions = [...positions];
    newPositions[index] = { ...newPositions[index], lat, lng };
    setPositions(newPositions);
  };

  const customMarker = new L.icon({
    iconUrl: CityMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const {
    user,
    isAuthenticated
  } = useAuth0();

  return (
    <>
    {isAuthenticated && user.name === "admin@vteam.se" ?(
    <MapContainer center={[59.075700, 14.742024]} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {positions.map((position, index) => (
        <Marker
          icon={customMarker}
          key={position.id}
          position={[position.lat, position.lng]}
          // ange att skootrarna är "draggable" i scootervy ?
          draggable={false}
          onDragEnd={(event) => handleMarkerDragEnd(index, event)}
        >
          <Popup>{position.content}</Popup>
        </Marker>
      ))}
    </MapContainer>) : <p>Ej inloggad som admin, kan ej visa karta över städer </p> }
    </>
  );
};

export default MapComponentStations;
