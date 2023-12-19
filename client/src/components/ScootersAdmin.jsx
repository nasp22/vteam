import { useEffect, useState } from 'react';
import { fetchData } from '../GET_request';

const ScootersAdmin = () => {
  const [scooters, setScooters] = useState([]);
  const [selectedScooterId, setSelectedScooterId] = useState('');
  const [selectedScooter, setSelectedScooter] = useState('');

  useEffect(() => {
    const fetchDataFromAPIScooters = async () => {
      const result = await fetchData('scooter');
      setScooters(result.data);
    };

    const fetchDataFromAPIScooter = async () => {
      const result = await fetchData(`scooter/${selectedScooterId}`);
      setSelectedScooter(result.data);
    };

    fetchDataFromAPIScooters();
    fetchDataFromAPIScooter();
  }, [selectedScooterId]);

  const handleScooterChange = (event) => {
    setSelectedScooterId(event.target.value);
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
      <label htmlFor="stationSelect">Välj en scooter i listan:</label><br></br>
      <select id="stationSelect" onChange={handleScooterChange} value={selectedScooterId}>
        <option value="">Select a scooter</option>
        {scooters.map((scooter) => (
          <option key={scooter._id} value={scooter._id}>
            {scooter._id}: {scooter.status} {scooter.model}
          </option>
        ))}
      </select>

      {selectedScooterId && (
        <div>
          <h3>Vald scooter id: {selectedScooter._id}</h3>
          <p>Id: = {selectedScooter._id}</p>
          <p>status: = {selectedScooter.status}</p>
          <button onClick={handleDelButton}> Delete</button>
          <button onClick={handleEditButton}> Edit</button>
        </div>
      )}
    </div>
  );
};

export default ScootersAdmin
