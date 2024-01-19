import React from "react";
import React, { useEffect, useState } from 'react';
import { putData } from '../PUT_request';
import SignedInUser from "./SignedInUser";
import { useHistory } from 'react-router-dom';
import '../style/UpdateProfile.css';
import '../style/Buttons.css';


const UpdateProfile = () => {
  const loggedInUser = SignedInUser();
  const history = useHistory();
  const [editedUserData, setEditedUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
  });

  useEffect(() => {
    setEditedUserData({
      first_name: loggedInUser.first_name || '',
      last_name: loggedInUser.last_name || '',
      email: loggedInUser.email || '',
      phone_number: loggedInUser.phone_number || '',
      role: loggedInUser.role || '',
    });
  }, [loggedInUser]);

  const handleUpdateProfile = async () => {
    try {
      await putData('user', loggedInUser.auth_id, editedUserData);
      alert("User updated successfully")
      history.push('/profile');
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  const handleInputChange = (event) => {
    setEditedUserData({
      ...editedUserData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile-form-container">
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Förnamn
            <input type="text" className="update-profile-input" name="first_name" defaultValue={loggedInUser.first_name} onChange={handleInputChange}/>
          </label>

        </div>
        <br />
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Efternamn
            <input type="text" className="update-profile-input" name="last_name" defaultValue={loggedInUser.last_name} onChange={handleInputChange}/>
          </label>
        </div>
        <br />
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Email
            <input type="text" className="update-profile-input" name="email" defaultValue={loggedInUser.email} onChange={handleInputChange} />
          </label>
        </div>
        <br />
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Telefon
            <input type="text" className="update-profile-input" name="phone_number" defaultValue={loggedInUser.phone_number} onChange={handleInputChange} />
          </label>
        </div>
        <br />
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Roll (ppu* ppm**)
            <select className="update-profile-select" name="role" defaultValue={loggedInUser.role} onChange={handleInputChange} >
              <option value=""></option>
              <option value="ppu">PPU</option>
              <option value="ppm">PPM</option>
            </select>
          </label>
        </div>
        <div>
          <button className="green-button" onClick={handleUpdateProfile}>Uppdatera</button>
        </div>
        <br />
        <p>* Betala per resa</p>
        <p>** Månadsprenumerant</p>
      </div>
    </div>
  );
};

export default UpdateProfile
