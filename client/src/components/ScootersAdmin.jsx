import { useEffect, useState } from 'react';
import { fetchData } from '../utils/GET_request';

const ScootersAdmin = () => {
  const [scooters, setScooters] = useState([]);
  const [selectedScooterId, setSelectedScooterId] = useState('');
  const [selectedScooter, setSelectedScooter] = useState('');
  useEffect(() => {
    // Skapa fetch med önskad endpoint
    const fetchDataFromAPIscooters = async () => {
      const result = await fetchData('scooter');
      setScooters(result.data.scooters);
    };

    const fetchDataFromAPIscooter = async () => {
      const result = await fetchData(`scooter/${selectedScooterId}`);
      // change to data.user later on, message for now
      setSelectedScooter(result.message);
    };

    fetchDataFromAPIscooters();
    fetchDataFromAPIscooter();
  }, [selectedScooterId]);

  const handleUserChange = (event) => {
    setSelectedScooterId(event.target.value);
  };
  console.log(scooters)
  return (
    <div>
      <h2>ScooterAdmin</h2>
      <label htmlFor="scooterSelect">Välj en scooter i listan:</label><br></br>
      <select id="scooterSelect" onChange={handleUserChange} value={selectedScooterId}>
        <option value="">Id: Status - Station</option>
        {scooters.map((scooter) => (
          <option key={scooter.id} value={scooter.id}>
            {scooter.id}: {scooter.status} - {scooter.station}
          </option>
        ))}
      </select>

      {selectedScooterId && (
        <div>
          <h3>Vald scooter id: {selectedScooterId}</h3>
          <p>...scooter/:id message = {selectedScooter}</p>
        </div>
      )}
    </div>
  );
};

export default ScootersAdmin
