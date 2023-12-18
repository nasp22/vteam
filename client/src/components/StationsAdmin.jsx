import { useEffect, useState } from 'react';
import { fetchData } from '../utils/GET_request';
import { useParams } from 'react-router-dom';

const StationsAdmin = () => {
  const [stations, setStations] = useState([]);
  const urlId = useParams()
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedStation, setSelectedStation] = useState([]);
  const { id } = useParams();

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
        <option value="">Select a station</option>
        {stations.map((station) => (
          <option key={station._id} value={station._id}>
            {station.city}: {station._id} - {station.name}
          </option>
        ))}
      </select>

      {selectedStationId && (
        <div>
          <h3>Vald station id: {selectedStation.name}</h3>
          <p> mer info:
          <p>Namn: {selectedStation.name}</p>
          <p>Id:{selectedStation._id}</p>
          <p>Antal scootrar: {selectedStation.scooter_quantity}</p>
          </p>
          <button onClick={handleDelButton}> Delete</button>
          <button onClick={handleEditButton}> Edit</button>
        </div>
      )}
    </div>
  );
};

export default StationsAdmin
