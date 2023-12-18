import * as L from "leaflet";
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { fetchData } from "../utils/GET_request";
import { useParams } from 'react-router-dom';

const MapComponentCity = () => {
  const [city, setCity] = useState([]);
  const cityId = useParams();
  const [stations, setStations] = useState([]);
  const [scooters, setScooters] = useState([]);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const [stationsFetch, cityFetch, scooterFetch] = await Promise.all([
          fetchData('station'),
          fetchData(`city/${cityId.id}`),
          fetchData('scooter'),
        ]);

        setStations(stationsFetch.data);
        setCity(cityFetch.data);
        setScooters(scooterFetch.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataFromAPI();
  }, [cityId.id]);

  // console.log(city);
  // console.log(stations);
  // console.log(scooters);

  const filteredStations = stations.filter((station) => station.city === city.name);
  const filteredScooters = scooters.filter((scooter) => scooter.station === 0 ||
    filteredStations.some((station) => scooter.station === station._id)
  );

  console.log(filteredScooters);
  console.log(filteredStations);

  if (!city.position) {
    return <p>Laddar...</p>;
  }

  const StationMarkerIcon = require('../assets/station_pos.png');
  const ScooterMarkerIcon = require('../assets/scooter_pos.png');


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

    return (
      <>
      <h1>{city.name}</h1>
      <MapContainer center={[city.position.lat, city.position.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredStations.map((station, index) => (
          <Marker
            icon={customMarkerStation}
            key={station._id}
            position={[station.position.lat, station.position.lng]}
            draggable={false}
          >
            <Popup>
            <div>
                <p>Station:{station.name}</p>
                <p>Antal Scootrar: {station.scooter_quantity}</p>
                <button>
                <a href={`/stations/${station._id}`}>Administrera Stationen</a>
                </button>
              </div>

            </Popup>
          </Marker>
        ))}

        {filteredScooters.map((scooter, index) => (
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
                <a href={`/scooters`}>Administrera scooter</a>
              </div>
            </Popup>
          </Marker>)
        ))}
      </MapContainer>
      </>
    );
  };

  export default MapComponentCity;
