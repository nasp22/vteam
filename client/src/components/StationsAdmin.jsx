import { useEffect, useState } from 'react';
import { fetchData } from '../utils/GET_request';

const StationsAdmin = () => {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedStation, setSelectedStation] = useState([]);

  useEffect(() => {
    const fetchDataFromAPIstations = async () => {
      const result = await fetchData('station');
      setStations(result.data);
    };

    const fetchDataFromAPIstation = async () => {
      if (selectedStationId) {
        const result = await fetchData(`station/${selectedStationId}`);
        setSelectedStation(result.data);
      }

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
        <option value="">Välj en station</option>
        {stations.map((station) => (
          <option key={station._id} value={station._id}>
            {station.city}: {station._id} - {station.name}
          </option>
        ))}
      </select>

      {selectedStationId && (
        <div>
          <h3>Vald station id: {selectedStation.name}</h3>
          <p>Namn: {selectedStation.name}<br/>
          Id:{selectedStation._id}<br/>
          Antal scootrar: {selectedStation.scooter_quantity}<br/>
          </p>
          <button onClick={handleDelButton}> Delete</button>
          <button onClick={handleEditButton}> Edit</button>
        </div>
      )}
    </div>
  );
};

export default StationsAdmin
