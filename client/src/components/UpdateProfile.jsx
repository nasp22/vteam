import { useState } from 'react';
import SignedInUser from "./SignedInUser";
import { useHistory } from 'react-router-dom';
import {putData} from '../PUT_request';

const UpdateProfile = () => {
  const user = SignedInUser();
  const history = useHistory();
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

  const handleUpdateUser = async () => {
    await putData('user', user._id, { first_name: firstName });
    await putData('user', user._id, { last_name: lastName });
    await putData('user', user._id, { last_name: email });
    await putData('user', user._id, { phone_number: phoneNumber });
    await putData('user', user._id, { role: role });

    history.push('/profile');
  };

  return (
    <div>
      <div>
        <label>
          Förnamn:
          <input type="text" value={firstName} onChange={handleFirstNameChange} />
        </label>
        <br />
        <label>
          Efternamn:
          <input type="text" value={lastName} onChange={handleLastNameChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="text" value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <label>
          Mobilnummer:
          <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
        </label>
        <br />
        <label>
          Välj roll:
          <select value={role} onChange={handleRoleChange}>
            <option value="ppu">PPU</option>
            <option value="ppm">PPM</option>
          </select>
        </label>
      </div>
      <div>
        <button onClick={handleUpdateUser}>Uppdatera information</button>
      </div>
    </div>
  );
};

export default UpdateProfile
