import * as L from "leaflet"
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState} from 'react';
import { fetchData } from "../utils/GET_request";
import { useParams } from 'react-router-dom';

// import { useAuth0 } from "@auth0/auth0-react";
const MapComponentCity = () => {

    const cityId = useParams();
    // const [city, setCity] = useState([]);

    const city =
      {        "id": 2,
        "name": "Stockholm",
        "position": {
            "lat": 59.31949,
            "lng": 18.07506
          }

        };

    const [stations, setStations] = useState([]);
    // const [scooters, setScooters] = useState([]);

    useEffect(() => {
      const fetchDataFromAPIstations = async () => {
        const stationsFetch = await fetchData('station');
        setStations(stationsFetch.data.stations);
      };

      // const fetchDataFromAPICity = async () => {
      //   const CityFetch = await fetchData(`city/${cityId}`);
      //   setCity(CityFetch.data.city);
      // };

      // const fetchDataFromAPIscooters = async () => {
      //   const scooterFetch = await fetchData('scooter');
      //   setScooters(scooterFetch.data.scooters);
      // };

      fetchDataFromAPIstations();
      // fetchDataFromAPICity();
      // fetchDataFromAPIscooters();
    }, []);


    const filteredStations = stations.filter((station) => station.city === city.name);
    // const filteredScooters = scooters.filter((scooter) =>
    //   filteredStations.some((station) => scooter.station === station.id)
    // );

    // console.log(filteredScooters)
    const StationMarkerIcon = require('../assets/station_pos.png')
    // const ScooterMarkerIcon = require('../assets/scooter_pos.png')

    const customMarkerStation = new L.icon({
      iconUrl: StationMarkerIcon,
      iconSize: [55, 45],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // const customMarkerScooter = new L.icon({
    //   iconUrl: ScooterMarkerIcon,
    //   iconSize: [55, 45],
    //   iconAnchor: [16, 32],
    //   popupAnchor: [0, -32],
    // });

    return (
      <>
      {/* {isAuthenticated && user.name === "admin@vteam.se" ?( */}
      <h1>{city.name}</h1>
      <MapContainer center={[city.position.lat, city.position.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredStations.map((station, index) => (
          <Marker
            icon={customMarkerStation}
            key={station.id}
            position={[station.position.lat, station.position.lng]}
            // ange att scootrarna är "draggable" i scootervy ?
            draggable={false}
            // onDragEnd={(event) => handleMarkerDragEnd(index, event)}
            // onClick={handleClickMarker}
          >
            <Popup>{station.name}</Popup>
          </Marker>
        ))}

        {/* {filteredScooters.map((scooter, index) => (
          <Marker
            icon={customMarkerScooter}
            key={scooter.id}
            position={[scooter.position.lat, scooter.position.lng]}
            // ange att scootrarna är "draggable" i scootervy ?
            // draggable={false}
            // onDragEnd={(event) => handleMarkerDragEnd(index, event)}
            // onClick={handleClickMarker}
          >
            <Popup>Scooter:{scooter.id}</Popup>
          </Marker>
        ))} */}
      </MapContainer>
      {/* : <p>Ej inloggad som admin, kan ej visa karta över städer </p> } */}
      </>
    );
  };

  export default MapComponentCity;
