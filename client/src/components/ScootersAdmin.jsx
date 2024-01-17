import React, { useEffect, useState } from 'react';
import { putData } from "../PUT_request"
import { delData } from "../DEL_request"
import { postData } from "../POST_request"
import { fetchData } from "../GET_request"


const ScootersAdmin = () => {
  const [scooters, setScooters] = useState([]);
  const [selectedScooterId, setSelectedScooterId] = useState('');
  const [selectedScooter, setSelectedScooter] = useState('');
  const [statusList, setStatusList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScooterData, setEditedScooterData] = useState({
    brand: '',
    model: '',
    status: 0,
    city: '',
  });
  const [isNewScooterOpen, setNewScooterOpen] = useState(false);
  const [newScooterData, setNewScooterData] = useState({
    brand: '',
    model: '',
    status: 0,
    city: '',
  });
  const [lowBatteryScooters, setLowBatteryScooters] = useState([]);
  const [status1004Scooters, setStatus1004Scooters] = useState([]);

  useEffect(() => {
    const fetchDataFromAPIScooters = async () => {
      const result = await fetchData('scooter');
      setScooters(result.data);
    };

    const fetchDataFromAPIScooter = async () => {
      const result = await fetchData(`scooter/${selectedScooterId}`);
      setSelectedScooter(result.data);
      setEditedScooterData(result.data);
    };

    const fetchStatusList = async () => {
      try {
        const result = await fetchData('status');
        setStatusList(result.data);
      } catch (error) {
        console.error('Error fetching status list:', error.message);
      }
    };

    const fetchCityList = async () => {
      try {
        const result = await fetchData('city');
        setCityList(result.data);
      } catch (error) {
        console.error('Error fetching city list:', error.message);
      }
    };

    const fetchLowBatteryScooters = () => {
      const lowBatteryScootersList = scooters.filter(
        (scooter) => scooter.status !== 1003 && scooter.battery < 10
      );
      setLowBatteryScooters(lowBatteryScootersList);
    };

    const fetchStatus1004Scooters = () => {
      const status1004ScootersList = scooters.filter(
        (scooter) => scooter.status === 1004
      );
      setStatus1004Scooters(status1004ScootersList);
    };

    fetchLowBatteryScooters();
    fetchStatus1004Scooters();
    fetchDataFromAPIScooters();
    fetchDataFromAPIScooter();
    fetchStatusList();
    fetchCityList();
  }, [selectedScooterId, scooters]);

  const handleScooterChange = (event) => {
    setSelectedScooterId(event.target.value);
  };

  const handleDelButton = async () => {
    try {
      await delData('scooter', selectedScooterId);
      console.log('Scooter deleted successfully');

      setScooters(scooters.filter(scooter => scooter._id !== selectedScooterId));
      setSelectedScooterId('');
      setSelectedScooter('');
    } catch (error) {
      console.error('Error deleting scooter:', error.message);
    }
  };

  const handleEditButton = () => {
    setIsEditing(true);
  };

  const openNewScooter = () => {
    setNewScooterOpen(true);
  };

  const closeNewScooter = () => {
    setNewScooterOpen(false);
  };

  const handleSaveButton = async () => {
    try {
      await putData('scooter', selectedScooterId, editedScooterData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating scooter:', error.message);
    }
  };

  const handleCancelEditButton = () => {
    setIsEditing(false);
    setEditedScooterData(selectedScooter);
  };

  const handleInputChange = (event) => {
    setEditedScooterData({
      ...editedScooterData,
      [event.target.name]: event.target.value,
    });
  };

  const createNewScooter = async () => {
    try {
      const result = await postData('scooter', newScooterData);
      setScooters([...scooters, result.data]);
      closeNewScooter();
    } catch (error) {
      console.error('Error creating new scooter:', error.message);
    }
  };

  const getStatusInfo = (statusCode) => {
    return statusList.find((status) => status.status_code === statusCode);
  };

  const sortByCity = (scooterList) => {
    const sortedByCity = {};
    scooterList.forEach((scooter) => {
      if (!sortedByCity[scooter.city]) {
        sortedByCity[scooter.city] = [];
      }
      sortedByCity[scooter.city].push(scooter);
    });
    return sortedByCity;
  };

  const sortedScooters = sortByCity(scooters);
  const cities = Object.keys(sortedScooters);
  return (

<div>
<div className="edit_div">
      <div className="edit_div">
        <h2>Behöver köras till laddstation:</h2>
        <ul>
          {lowBatteryScooters.map((scooter) => (
            <li key={scooter._id}>{scooter._id} - {scooter.city} Batteri (%): </li>
          ))}
        </ul>
        </div>
        <div className="edit_div">
        <h2>Kräver tillsyn:</h2>
        <ul>
          {status1004Scooters.map((scooter) => (
            <li key={scooter._id}>{scooter._id} - {scooter.city}</li>
          ))}
        </ul>
        </div>
      </div>
    <label htmlFor="scooterSelect">Välj en scooter:</label>
      <br />
      <select id="scooterSelect" onChange={handleScooterChange} value={selectedScooterId}>
        <option value="">Select a scooter</option>
        {cities.map((city) => (
          <optgroup key={city} label={city}>
            {sortedScooters[city].map((scooter) => (
              <option key={scooter._id} value={scooter._id}>
                {scooter._id} - {scooter.status}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* {isNewScooterOpen && (
        <div className="view_div">
          <label htmlFor="newBrand">Märke:</label>
          <input
            type="text"
            id="newBrand"
            value={newScooterData.brand}
            onChange={(e) => setNewScooterData({ ...newScooterData, brand: e.target.value })}
          />

          <label htmlFor="newModel">Modell:</label>
          <input
            type="text"
            id="newModel"
            value={newScooterData.model}
            onChange={(e) => setNewScooterData({ ...newScooterData, model: e.target.value })}
          />

          <label htmlFor="newStatus">Status:</label>
          <select
            id="newStatus"
            value={newScooterData.status}
            onChange={(e) => setNewScooterData({ ...newScooterData, status: e.target.value })}
          >
            <option value="">Välj en status</option>
            {statusList.map((status) => (
              <option key={status.status_code} value={status.status_code}>
                {status.status_code} - {status.status_name}
              </option>
            ))}
          </select>

          <label htmlFor="newCity">Stad:</label>
          <select
            id="newCity"
            value={newScooterData.city}
            onChange={(e) => setNewScooterData({ ...newScooterData, city: e.target.value })}
          >
            <option value="">Välj en stad</option>
            {cityList.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          <button onClick={createNewScooter}>Skapa</button>
          <button onClick={closeNewScooter}>Avbryt</button>
        </div>
      )}
      <br></br>
      <button className='edit_div' onClick={openNewScooter}>Skapa ny scooter</button> */}
      {selectedScooterId && (
        <div className="view_div">
          <h3>
            {selectedScooter.brand} {selectedScooter.model} - {selectedScooter.status}
          </h3>
          {statusList && statusList.length > 0 && (
            <div>
              <p>Status: "{getStatusInfo(selectedScooter.status)?.status_name}"</p>
              <p>Description: {getStatusInfo(selectedScooter.status)?.description}</p>
              <p>Stad: {selectedScooter.city}</p>
            </div>
          )}
          <p>Id: {selectedScooter._id}</p>
          {isEditing ? (
            <div className="edit_div">
              <label htmlFor="brand">Märke:</label>
              <input
                type="text"
                name="brand"
                value={editedScooterData.brand}
                onChange={handleInputChange}
              />
              <br />
              <label htmlFor="model">Modell:</label>
              <input
                type="text"
                name="model"
                value={editedScooterData.model}
                onChange={handleInputChange}
              />
              <br />
              <label htmlFor="status">Status:</label>
              <select
                name="status"
                value={editedScooterData.status}
                onChange={handleInputChange}
              >
                <option value="">Välj en status</option>
                {statusList.map((status) => (
                  <option key={status.status_code} value={status.status_code}>
                    {status.status_code} - {status.status_name}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="city">Stad:</label>
              <select
                name="city"
                value={editedScooterData.city}
                onChange={handleInputChange}
              >
                <option value="">Välj en stad:</option>
                {cityList.map((city) => (
                  <option key={city._id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <br />
              <button onClick={handleSaveButton}>Spara</button>
              <button onClick={handleCancelEditButton}>Avbryt</button>
            </div>
          ) : (
            <div>
              <button onClick={handleEditButton}>Uppdatera scooter</button>
              {/* <button className="delete-button" onClick={handleDelButton}>Radera scooter</button> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScootersAdmin;
