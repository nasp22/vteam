import React, { useEffect, useState } from 'react';
import { putData } from "../PUT_request";
import { delData } from "../DEL_request";
import { postData } from "../POST_request";
import { fetchData } from "../GET_request";
import '../style/ScootersAdmin.css';
import '../style/Buttons.css';

const ScootersAdmin = () => {
  const [scooters, setScooters] = useState([]);
  const [selectedScooterId, setSelectedScooterId] = useState('');
  const [selectedScooter, setSelectedScooter] = useState('');
  const [statusList, setStatusList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScooterData, setEditedScooterData] = useState({
    model: '',
    status: 0,
    city: '',
  });
  const [isNewScooterOpen, setNewScooterOpen] = useState(false);
  const [newScooterData, setNewScooterData] = useState({
    model: '',
    status: 0,
    city: '',
  });
  const [lowBatteryScooters, setLowBatteryScooters] = useState([]);
  const [status1004Scooters, setStatus1004Scooters] = useState([]);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const scootersResult = await fetchData('scooter');
        setScooters(scootersResult.data);

        const statusResult = await fetchData('status');
        setStatusList(statusResult.data);

        const cityResult = await fetchData('city');
        setCityList(cityResult.data);

        const lowBatteryScootersList = scootersResult.data.filter(
          scooter => scooter.status !== 1003 && scooter.battery < 10
        );
        setLowBatteryScooters(lowBatteryScootersList);

        const status1004ScootersList = scootersResult.data.filter(
          scooter => scooter.status === 1004
        );
        setStatus1004Scooters(status1004ScootersList);

        if (selectedScooterId) {
          const scooterResult = await fetchData(`scooter/${selectedScooterId}`);
          setSelectedScooter(scooterResult.data);
          setEditedScooterData(scooterResult.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchDataFromAPI();
  }, [selectedScooterId]);

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
    return statusList.find(status => status.status_code === statusCode);
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
        <div className="edit_div scrollable-container">
          <h2>Behöver köras till laddstation:</h2>
          <ul>
            {lowBatteryScooters.map(scooter => (
              <li key={scooter._id}>{scooter.city} : {scooter._id} - Batteri: ({scooter.battery}%): </li>
            ))}
          </ul>
        </div>
        <div className="edit_div scrollable-container">
          <h2>Kräver tillsyn:</h2>
          <ul>
            {status1004Scooters.map(scooter => (
              <li key={scooter._id}>{scooter.city} : {scooter._id} </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="scooter-admin-start-container">
        <label htmlFor="scooterSelect" className="scooter-admin-label">Välj scooter
          <select id="scooterSelect" className="scooter-admin-select" onChange={handleScooterChange} value={selectedScooterId}>
            <option value=""></option>
            {cities.map(city => (
              <optgroup key={city} label={city}>
                {sortedScooters[city].map(scooter => (
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
              {statusList.map(status => (
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
              {cityList.map(city => (
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
              {selectedScooter.model} - {selectedScooter.status}
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
              <label className="scooter-admin-label">Modell
                <input
                  className="scooter-admin-input"
                  type="text"
                  name="model"
                  defaultValue={editedScooterData.model}
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
                  {statusList.map(status => (
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
                  defaultValue={editedScooterData.city}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  {cityList.map(city => (
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

      <br></br>
      {selectedScooter.log && (
        <div>
          <h1>Logg:</h1>
              <table className="log-table">
                <thead>
                  <tr className="log-tr">
                    <th className="log-th">Id</th>
                    <th className="log-th">Starttid</th>
                    <th className="log-th">Sluttid</th>
                    <th className="log-th">Startposition (lat, lng)</th>
                    <th className="log-th">Slutposition (lat, lng)</th>
                  </tr>
                </thead>
                <tbody>
          {selectedScooter.log.reverse().map((item, index) => (
          <tr key={index} className="log-th">
              <>
                <td className="log-td">{item._id}</td>
                <td className="log-td">{new Date(item.from_time).toLocaleString()}</td>
                <td className="log-td">{new Date(item.to_time).toLocaleString()}</td>
                <td className="log-td">{item.start_position.lat}, {item.start_position.lng}</td>
                <td className="log-td">{item.start_position.lat}, {item.start_position.lng}</td>
              </>
            </tr>
        ))}
            </tbody>
          </table>
      </div>
      )}
    </div>
  );
};

export default ScootersAdmin;
