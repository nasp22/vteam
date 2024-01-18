import * as L from "leaflet";
import { TileLayer, Marker, Popup, MapContainer, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { React, useEffect, useState } from 'react';
import { fetchData } from "../GET_request";
import { Link } from 'react-router-dom';
import SignedInUser from "./SignedInUser";


const MapComponentCity = () => {
  const user = SignedInUser()
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

    const intervalId = setInterval(fetchDataFromAPIscooters, 5000);

    return () => {
      clearInterval(intervalId);
    };
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

  const stationRadius = 50;

  const Legend = () => {
    const map = useMap();

    useEffect(() => {
      const legend = L.control({ position: 'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML = `
          <p><span class="circle blue"></span> Definierad parkering </br>(Parkera inom detta område och få 5 kr avdrag i startavgift)</p>
        `;
        return div;
      };

      legend.addTo(map);

      return () => {
        legend.remove();
      };
    }, [map]);

    return null;
  };

  return (
    <>
      <MapContainer key={Center} center={Center} zoom={Zoom} style={{ height: '70vh', width: '100%' }}>
        <Legend/>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {stations.map((station) => (
          <>
            <Circle
              center={[station.position.lat, station.position.lng]}
              radius={stationRadius}
              color="blue"
              fillColor="blue"
              fillOpacity={0.2}

            >
            </Circle>
            <Marker
              icon={customMarkerStation}
              key={station._id}
              position={[station.position.lat, station.position.lng]}
            >
            <Popup>
            <div>
                <h3>{station.name}</h3>
                <h4>Antal Scootrar: {station.scooters.length}</h4>
                {station.scooters.map((scooter, index) => (
                  <div>
                  <p>scooter id: {scooter.id}</p>
                  <p>status: {scooter.status}
                  {scooter.status === 1001 || scooter.status === 1003 && (
                    <Link to={`/rent/${scooter.id}`}>Hyr mig!</Link>
                  )}</p>
                  </div>

                ))}
              </div>
            </Popup>
            </Marker>
          </>
        ))}
        {userPosition.length === 2 && (
          <Marker
            icon={customMarkerUser}
            key={userPosition.toString()}
            position={userPosition}
          />
        )}
        {scooters.map((scooter) => (
        scooter.station.name === null && (scooter.status === 1001 || scooter.status === 1003) && (
          <Marker
            icon={customMarkerScooter}
            key={`scooter-${scooter._id}`}
            position={[scooter.position.lat, scooter.position.lng]}
          >
            <Popup>
              <div>
                <p>Scooter Id: {scooter._id}</p>
                <p>Status: {scooter.status}</p>
                <Link to={`/rent/${scooter._id}`}>Hyr mig!</Link>
              </div>
            </Popup>
          </Marker>
        )
      ))}

      </MapContainer>
      {userPosition.length === 2 && (
        <button className="map_button" onClick={handleButtonClicked}>Min position</button>
      )}
    </>

  );
};

export default MapComponentCity;
