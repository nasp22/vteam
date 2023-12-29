import * as L from "leaflet"
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { fetchData } from '../GET_request';
import { NavLink as RouterNavLink } from "react-router-dom";
import { NavLink } from "reactstrap";

const CityMarkerIcon = require('../assets/city_position.png')

const MapComponentCities = () => {

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchDataFromAPIcities = async () => {
      const result = await fetchData('city');
      setCities(result.data);
    };

    fetchDataFromAPIcities();
  },);

  const customMarker = new L.icon({
    iconUrl: CityMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <>

    <MapContainer center={[59.075700, 14.742024]} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

    {cities.map((city, index) => (
      city.position && (
        <Marker
          icon={customMarker}
          key={city._id}
          position={[city.position.lat, city.position.lng]}
          draggable={false}
        >
          <Popup>
            <div>
              <h3>{city.name}</h3>
              <p>Station details</p>
              <p>
                <button>
              <NavLink
                tag={RouterNavLink}
                to={`/city/${city._id}`}
              >
               Se stationer och scootrar i {city.name}</NavLink></button>
              </p>
            </div>
          </Popup>
        </Marker>
      )
    ))}
    </MapContainer>

    </>
  );
};

export default MapComponentCities;
