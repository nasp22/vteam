// StationsAdmin.jsx
import React, { useEffect, useState } from 'react';
import { fetchData } from '../utils/GET_request';
import { useParams } from 'react-router-dom';

const StationsAdmin = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const { stationId } = useParams();

  useEffect(() => {
    const fetchDataFromAPIstations = async () => {
      const result = await fetchData('station');
      setStations(result.data.stations);
    };

    const fetchDataFromAPIstation = async () => {
      const result = await fetchData(`station/${stationId}`);
      setSelectedStation(result.message);
    };

    fetchDataFromAPIstations();
    fetchDataFromAPIstation();
  }, [stationId]);

  const handleStationChange = (event) => {
    const newStationId = event.target.value;
    window.history.pushState({}, null, `/stations/${newStationId}`);
  };

  return (
    <div>
      <h2>StationAdmin</h2>
      <label htmlFor="stationSelect">Välj en station i listan:</label><br />
      <select id="stationSelect" onChange={handleStationChange} value={stationId}>
        <option value="">Select a station</option>
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.city}: {station.id} - {station.name}
          </option>
        ))}
      </select>

      {selectedStation && (
        <div>
          <h3>Vald station id: "kommer senare"</h3>
          <p>...station/:id message = {selectedStation}</p>
        </div>
      )}
    </div>
  );
};

export default StationsAdmin;
