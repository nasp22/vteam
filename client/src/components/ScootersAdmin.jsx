import { useEffect, useState } from 'react';
import { fetchData } from '../utils/GET_request';

const StationsAdmin = () => {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  useEffect(() => {
    // Skapa fetch med önskad endpoint
    const fetchDataFromAPIstations = async () => {
      const result = await fetchData('station');
      setStations(result.data.stations);
    };

    const fetchDataFromAPIstation = async () => {
      const result = await fetchData(`station/${selectedStationId}`);
      // change to data.user later on, message for now
      setSelectedStation(result.message);
    };

    fetchDataFromAPIstations();
    fetchDataFromAPIstation();
  }, [selectedStationId]);

  const handleUserChange = (event) => {
    setSelectedStationId(event.target.value);
  };

  const handleDelButton = async () => {

    console.log("Delete button clicked");
  };

  const handleEditButton = async () => {

    console.log("Edit button clicked");
  };

  return (
    <div>
      <h2>StationAdmin</h2>
      <label htmlFor="stationSelect">Välj en station i listan:</label><br></br>
      <select id="stationSelect" onChange={handleUserChange} value={selectedStationId}>
        <option value="">Select a station</option>
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.city}: {station.id} - {station.name}
          </option>
        ))}
      </select>

      {selectedStationId && (
        <div>
          <h3>Vald station id: {selectedStationId}</h3>
          <p>...station/:id message = {selectedStation}</p>
          <button onClick={handleDelButton}>Delete</button>
          <button onClick={handleEditButton}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default StationsAdmin
