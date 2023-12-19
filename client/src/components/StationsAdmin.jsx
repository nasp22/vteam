import { useEffect, useState } from 'react';
import { fetchData } from '../GET_request';

const StationAdmin = () => {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setselectedStationId] = useState('');
  const [selectedStation, setselectedStation] = useState('');

  useEffect(() => {
    const fetchDataFromAPIstations = async () => {
      const result = await fetchData('station');
      setStations(result.data);
    };

    const fetchDataFromAPIstation = async () => {
      const result = await fetchData(`station/${selectedStationId}`);
      setselectedStation(result.data);
    };

    fetchDataFromAPIstations();
    fetchDataFromAPIstation();
  }, [selectedStationId]);

  const handleStationChange = (event) => {
    setselectedStationId(event.target.value);
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
      <select id="stationSelect" onChange={handleStationChange} value={selectedStationId}>
        <option value="">Select a station</option>
        {stations.map((station) => (
          <option key={station._id} value={station._id}>
            {station._id}: {station.last_name} {station.first_name}
          </option>
        ))}
      </select>

      {selectedStationId && (
        <div>
          <h3>Vald station: {selectedStation.name}</h3>
          <p>Id: = {selectedStation._id}</p>
          <p>Antal el-scootrar: = {selectedStation.scooter_quantity}</p>

          <button onClick={handleDelButton}> Delete</button>
          <button onClick={handleEditButton}> Edit</button>
        </div>
      )}
    </div>
  );
};

export default StationAdmin
