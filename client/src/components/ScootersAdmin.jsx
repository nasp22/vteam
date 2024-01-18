import React, { useEffect, useState } from 'react';
import { putData } from "../PUT_request"
import { delData } from "../DEL_request"
import { postData } from "../POST_request"
import { fetchData } from "../GET_request"
import '../style/ScootersAdmin.css'
import '../style/Buttons.css';


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
    <div className="scooter-admin-start-container">
      <label htmlFor="scooterSelect" className="scooter-admin-label">Välj scooter
        <select id="scooterSelect" className="scooter-admin-select" onChange={handleScooterChange} value={selectedScooterId}>
          <option value=""></option>
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
      </label>
    </div>

    <button className='blue-button' onClick={openNewScooter}>Skapa ny scooter</button>

      {isNewScooterOpen && (
        <div className="scooter-admin-form-group">
          <label className="scooter-admin-label" htmlFor="newBrand">Märke
            <input
              className="scooter-admin-input"
              type="text"
              id="newBrand"
              value={newScooterData.brand}
              onChange={(e) => setNewScooterData({ ...newScooterData, brand: e.target.value })}
            />
          </label>

          <label className="scooter-admin-label" htmlFor="newModel">Modell
            <input
              className="scooter-admin-input"
              type="text"
              id="newModel"
              value={newScooterData.model}
              onChange={(e) => setNewScooterData({ ...newScooterData, model: e.target.value })}
            />
          </label>

          <label className="scooter-admin-label" htmlFor="newStatus">Status
            <select
              className="scooter-admin-select"
              id="newStatus"
              value={newScooterData.status}
              onChange={(e) => setNewScooterData({ ...newScooterData, status: e.target.value })}
            >
              <option value=""></option>
              {statusList.map((status) => (
                <option key={status.status_code} value={status.status_code}>
                  {status.status_code} - {status.status_name}
                </option>
              ))}
            </select>
          </label>

          <label className="scooter-admin-label" htmlFor="newCity">Stad
            <select
              className="scooter-admin-select"
              id="newCity"
              value={newScooterData.city}
              onChange={(e) => setNewScooterData({ ...newScooterData, city: e.target.value })}
            >
              <option value=""></option>
              {cityList.map((city) => (
                <option key={city._id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>

          <button className="green-button" onClick={createNewScooter}>Skapa</button>
          <button className="red-button" onClick={closeNewScooter}>Avbryt</button>
        </div>
      )}
      {selectedScooterId && (
        <div>
          <div className="scooter-admin-table-container">
            <h3>
              {selectedScooter.brand} {selectedScooter.model} - {selectedScooter.status}
            </h3>
            <table className="scooter-admin-table">
              <thead>
                <tr className="scooter-admin-tr">
                  <th className="scooter-admin-th">Status</th>
                  <th className="scooter-admin-th">Beskrivning</th>
                  <th className="scooter-admin-th">Stad</th>
                  <th className="scooter-admin-th">ID</th>
                </tr>
              </thead>
              <tbody>
                {statusList && statusList.length > 0 && (
                <tr className="scooter-admin-tr">
                  <td className="scooter-admin-td">{getStatusInfo(selectedScooter.status)?.status_name}</td>
                  <td className="scooter-admin-td">{getStatusInfo(selectedScooter.status)?.description}</td>
                  <td className="scooter-admin-td">{selectedScooter.city}</td>
                  <td className="scooter-admin-td">{selectedScooter._id}</td>
                </tr>
                )}
              </tbody>
            </table>
          </div>

          {isEditing ? (
            <div className="scooter-admin-edit-container">
              <label className="scooter-admin-label">Märke
                <input
                  className="scooter-admin-input"
                  type="text"
                  name="brand"
                  value={editedScooterData.brand}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label className="scooter-admin-label">Modell
                <input
                  className="scooter-admin-input"
                  type="text"
                  name="model"
                  value={editedScooterData.model}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label className="scooter-admin-label">Status
                <select
                  className="scooter-admin-select"
                  name="status"
                  value={editedScooterData.status}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  {statusList.map((status) => (
                    <option key={status.status_code} value={status.status_code}>
                      {status.status_code} - {status.status_name}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label className="scooter-admin-label">Stad
                <select
                  className="scooter-admin-select"
                  name="city"
                  value={editedScooterData.city}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  {cityList.map((city) => (
                    <option key={city._id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <button className="green-button" onClick={handleSaveButton}>Spara</button>
              <button className="red-button" onClick={handleCancelEditButton}>Avbryt</button>
            </div>
          ) : (
            <div>
              <button className="green-button" onClick={handleEditButton}>Uppdatera</button>
              <button className="red-button" onClick={handleDelButton}>Radera</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScootersAdmin;
