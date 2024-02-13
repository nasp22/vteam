import React from "react";
import * as L from "leaflet";
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { fetchData } from "../GET_request";
import { useParams } from 'react-router-dom';

import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";

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

    // Uppdatera var 5:e sekund
    const intervalId = setInterval(fetchDataFromAPI, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [cityId.id]);

  // console.log(city);
  // console.log(stations);
  // console.log(scooters);

  const filteredStations = stations.filter((station) => station.city.name === city.name);
  const filteredScooters = scooters.filter((scooter) => scooter.station.name === null
  );

  // console.log(filteredScooters);
  // console.log(filteredStations);

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

    // custom cluster icon
    const createClusterCustomIcon = function (cluster) {
      return new divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: point(33, 33, true)
      });
    };

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
                <h3>{station.name}</h3>
                <h4>Antal Scootrar: {station.scooters.length}</h4>
                {station.scooters.map((scooter, index) => (
                  <div key={index} >
                  <p>scooter id: {scooter.id}</p>
                  <p>status: {scooter.status}</p>
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        ))}
                      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {filteredScooters.map((scooter, index) => (
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
          </Marker>)
        )}
      </MarkerClusterGroup>
      </MapContainer>
      </>
    );
  };

  export default MapComponentCity;
