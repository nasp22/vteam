import * as L from "leaflet";
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { fetchData } from "../GET_request";

const MapComponentCity = () => {
  const [userPosition, setUserPosition] = useState([]);
  const [stations, setStations] = useState([]);
  const [scooters, setScooters] = useState([]);
  const [Center, setCenter] = useState(["59.3293", "14.3686"]);
  const [Zoom, setZoom] = useState([5]);


  useEffect(() => {
    const fetchDataFromAPIstations = async () => {
      const stationsFetch = await fetchData('station');
      setStations(stationsFetch.data);
    };

    const fetchDataFromAPIscooters = async () => {
      const scooterFetch = await fetchData('scooter');
      setScooters(scooterFetch.data);
    };

    const updateUserPos = () => {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        {enableHighAccuracy: true, timeout: 12000, maximumAge: 30000, showLocationDialog: true}
      );
    };

    updateUserPos()
    fetchDataFromAPIstations();
    fetchDataFromAPIscooters();
  }, []);

  const StationMarkerIcon = require('../assets/station_pos.png');
  const ScooterMarkerIcon = require('../assets/scooter_pos.png');
  const UserMarkerIcon = require('../assets/current_pos.png');

  const customMarkerStation = new L.icon({
    iconUrl: StationMarkerIcon,
    iconSize: [55, 45],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const customMarkerScooter = new L.icon({
    iconUrl: ScooterMarkerIcon,
    iconSize: [55, 45],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const customMarkerUser = new L.icon({
    iconUrl: UserMarkerIcon,
    iconSize: [35, 30],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleButtonClicked = () => {
    setCenter(userPosition)
    setZoom(14)
  };

  return (
    <>
      <MapContainer key={Center} center={Center} zoom={Zoom} style={{ height: '70vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stations.map((station) => (
          <Marker
            icon={customMarkerStation}
            key={station._id}
            position={[station.position.lat, station.position.lng]}
          >
            <Popup>
              <div>
                <p>Station:{station.name}</p>
                <p>Antal Scootrar: {station.scooter_quantity}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {userPosition.length === 2 && (
          <Marker
            icon={customMarkerUser}
            key={userPosition.toString()}
            position={userPosition}
          >
          </Marker>
        )}

        {scooters.map((scooter) => (
          scooter.station === 0 && (
            <Marker
              icon={customMarkerScooter}
              key={scooter._id}
              position={[scooter.position.lat, scooter.position.lng]}
            >
              <Popup>
                <div>
                  <p>Scooter Id:{scooter._id}</p>
                  <p>Status: {scooter.status}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      {userPosition.length === 2 && (
      <button className="map_button" onClick={handleButtonClicked}>Min position </button>
      )}
    </>
  );
};

export default MapComponentCity;
