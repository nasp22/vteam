import * as L from "leaflet"
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { fetchData } from '../utils/GET_request';

// import { useAuth0 } from "@auth0/auth0-react";

const CityMarkerIcon = require('../assets/city_position.png')

const MapComponentCities = () => {

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');

  useEffect(() => {
    // Skapa fetch med önskad endpoint
    const fetchDataFromAPIcities = async () => {
      const result = await fetchData('city');
      setCities(result.data.city);
    };

    const fetchDataFromAPIcity = async () => {
      const result = await fetchData(`city/${selectedCityId}`);
      //  message , then API response
      setSelectedCity(`${result.message} här är den valda staden:`);
    };

    fetchDataFromAPIcities();
    fetchDataFromAPIcity();
  }, [selectedCityId]);

  const handleClickMarker = (cityId) => {
    setSelectedCityId(cityId);
  };

  const customMarker = new L.icon({
    iconUrl: CityMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // const {
  //   user,
  //   isAuthenticated
  // } = useAuth0();

  console.log(selectedCity)
  console.log(cities)

  return (
    <>
    {/* {isAuthenticated && user.name === "admin@vteam.se" ?( */}
    <MapContainer center={[59.075700, 14.742024]} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

    {cities.map((city, index) => (
      city.position && (
        <Marker
          icon={customMarker}
          key={city.id}
          position={[city.position.lat, city.position.lng]}
          draggable={false}
        >
          <Popup
          onClick={handleClickMarker}>
            <div>
              <h3>{city.name}</h3>
              <p>Station details</p>
              <p>
                Se stationer och scootrar i {city.name}
              </p>
            </div>
          </Popup>
        </Marker>
      )
    ))}
    </MapContainer>
    {/* )  */}
    {/* : <p>Ej inloggad som admin, kan ej visa karta över städer </p> } */}
    </>
  );
};

export default MapComponentCities;
