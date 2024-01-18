import { useState } from 'react';
import { putData } from '../PUT_request';
import SignedInUser from "./SignedInUser";
import '../style/UpdateProfile.css';
import '../style/Buttons.css';


const UpdateProfile = () => {
  const loggedInUser = SignedInUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleUpdateFirstName = async () => {
    await putData('user', loggedInUser._id, { first_name: firstName });
    window.location.reload();
  };

  const handleUpdateLastName = async () => {
    await putData('user', loggedInUser._id, { last_name: lastName });
    window.location.reload();
  };

  const handleUpdateEmail = async () => {
    await putData('user', loggedInUser._id, { email: email });
    window.location.reload();
  };

  const handleUpdatePhoneNumber = async () => {
    await putData('user', loggedInUser._id, { phone_number: phoneNumber });
    window.location.reload();
  };

  const handleUpdateRole = async () => {
    await putData('user', loggedInUser._id, { role: role });
    window.location.reload();
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile-form-container">
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Förnamn
            <input type="text" className="update-profile-input" value={firstName} onChange={handleFirstNameChange}/>
            <button className="green-button" onClick={handleUpdateFirstName}>Uppdatera</button>
          </label>
          
        </div>
        <br />
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Efternamn
            <input type="text" className="update-profile-input" value={lastName} onChange={handleLastNameChange}/>
            <button className="green-button" onClick={handleUpdateLastName}>Uppdatera</button>
          </label>
        </div>
        <br />
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Email
            <input type="text" className="update-profile-input" value={email} onChange={handleEmailChange} />
            <button className="green-button" onClick={handleUpdateEmail}>Uppdatera</button>
          </label>
        </div>
        <br />
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Telefon
            <input type="text" className="update-profile-input" value={phoneNumber} onChange={handlePhoneNumberChange} />
            <button className="green-button" onClick={handleUpdatePhoneNumber}>Uppdatera</button>
          </label>
        </div>
        <br />
        <div className="update-profile-form-group">
          <label className="update-profile-label">
            Roll (ppu* ppm**)
            <select className="update-profile-select" value={role} onChange={handleRoleChange} >
              <option value=""></option>
              <option value="ppu">PPU</option>
              <option value="ppm">PPM</option>
            </select>
            <button className="green-button" onClick={handleUpdateRole}>Uppdatera</button>
          </label>
        </div>
        <br />
        <p>* Betala per resa</p>
        <p>** Månadsprenumerant</p>
      </div>
    </div>
  );
};

export default UpdateProfile
