import React, { useEffect, useState } from 'react';
import { fetchData } from '../GET_request';
import { putData } from '../PUT_request';
import { postData } from '../POST_request';
import { delData } from '../DEL_request';

const StationAdmin = () => {
  const [stations, setStations] = useState([]);
  const [scooters, setScooters] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedScooter, setSelectedScooter] = useState('');
  const [availableScooters, setAvailableScooters] = useState([]);
  const [selectedScooterId, setSelectedScooterId] = useState('');

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const [stationsResult, stationResult, scootersResult, scooterResult] = await Promise.all([
          fetchData('station'),
          fetchData(`station/${selectedStationId}`),
          fetchData('scooter'),
          fetchData(`scooter/${selectedScooterId}`),
        ]);

        setSelectedScooter(scooterResult.data);
        setStations(stationsResult.data);
        setSelectedStation(stationResult.data);
        setScooters(scootersResult.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchDataFromAPI();
  }, [selectedStationId, selectedScooterId]);

  useEffect(() => {
    updateAvailableScooters();
  }, [selectedStationId, scooters]);

  const updateAvailableScooters = () => {
    const filteredScooters = scooters.filter(
      (scooter) => !scooter.station || scooter.station.id !== selectedStationId
    );
    setAvailableScooters(filteredScooters);
  };

  const handleStationChange = (event) => {
    setSelectedStationId(event.target.value);
    setSelectedStation(selectedStation);
  };

  const handleScooterChange = (event) => {
    setSelectedScooterId(event.target.value);
    // console.log(selectedScooter);
  };

  const handleAssignScooter = async () => {
    updateAvailableScooters();
    try {

      const result = await putData(`scooter`, `${selectedScooterId}`, {
        station: {
          id: selectedStation._id,
          name: selectedStation.name,
          city: selectedStation.city.name,
        },
      });

      setAvailableScooters(
        availableScooters.filter((scooter) => scooter._id !== selectedScooterId)
      );

      const updatedStation = { ...selectedStation };
      updatedStation.scooters.push({
        id: result.data._id,
        model: result.data.model,
        status: result.data.status,
      });

      setSelectedStation(updatedStation);

    } catch (error) {
      console.error('Error assigning scooter to station:', error.message);
    }

    try {
      await postData(`station/${selectedStationId}/${selectedScooterId}`, {
        id: selectedScooterId,
        model: selectedScooter.model,
        status: selectedScooter.status,
      });
    } catch (error) {
      console.error('Error assigning station to scooter:', error.message);
    }

    updateAvailableScooters();
};

  const handleRemoveAssignedScooter = async (scooterId) => {
    // console.log(selectedStationId);
    // console.log(selectedScooterId);

    try {
      await putData(`scooter`, `${selectedScooterId}`, {
        station: {
          id: null,
          name: null,
          city: null,
        },
      });

      await delData(`station`, `${selectedStationId}/${selectedScooterId}`);

      setAvailableScooters(
        availableScooters.filter((scooter) => scooter._id !== scooterId)
      );

      const updatedStation = { ...selectedStation };
      updatedStation.scooters = updatedStation.scooters.filter(
        (scooter) => scooter.id !== scooterId
      );
      setSelectedStation(updatedStation);
    } catch (error) {
      console.error('Error removing scooter from station:', error.message);
    }

    updateAvailableScooters();
  };

  const sortByCity = (stationList) => {
    const sortedByCity = {};
    stationList.forEach((station) => {
      if (!sortedByCity[station.city.name]) {
        sortedByCity[station.city.name] = [];
      }
      sortedByCity[station.city.name].push(station);
    });
    return sortedByCity;
  };

  const sortedStations = sortByCity(stations);
  const cities = Object.keys(sortedStations);

  return (
    <div>
      <h2>StationAdmin</h2>
      <label htmlFor="stationSelect">Välj en station i listan:</label>
      <br />
      <select id="stationSelect" onChange={handleStationChange} value={selectedStationId}>
        <option value="">Select a station</option>
        {cities.map((city) => (
          <optgroup key={city} label={city}>
            {sortedStations[city].map((station) => (
              <option key={station._id} value={station._id}>
                {station._id}: {station.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {selectedStationId && (
        <div className="edit_div">
          <h3>Vald station: {selectedStation.name}</h3>

          <p>Id: = {selectedStation._id}</p>
          <p>Antal el-scootrar: = {selectedStation.scooters ? selectedStation.scooters.length : 0}</p>
          <p>El-Scootrar på stationen:</p>

          {selectedStation.scooters ? (
            <div>
              {selectedStation.scooters.map((scooter) => (
                <ul key={scooter.id}>
                  {scooter.id} - {scooter.status}
                  <button onClick={() => handleRemoveAssignedScooter(scooter.id)}>
                    Ta bort scooter från station
                  </button>
                </ul>
              ))}
            </div>
          ) : (
            <p>Antal el-scootrar: = 0 </p>
          )}

          {availableScooters.length > 0 && (
            <>
              <label htmlFor="scooterSelect">Välj en scooter att lägga till:</label>
              <br />
              <select id="scooterSelect" onChange={handleScooterChange} value={selectedScooterId}>
                <option value="">Select a scooter</option>
                {availableScooters.map((scooter) => (
                  <option key={scooter._id} value={scooter._id}>
                    {scooter.city} - {scooter._id} - {scooter.status}
                  </option>
                ))}
              </select>

              {selectedStation.scooters && selectedStation.scooters.some(scooter => scooter.id === selectedScooterId) ? (
                <p>Scooter finns redan på stationen!</p>
              ) : (
                <button onClick={handleAssignScooter}>Lägg till</button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StationAdmin;
