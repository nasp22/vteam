import { useState } from 'react';
import { putData } from '../PUT_request';
import SignedInUser from "./SignedInUser";


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
    <div>
      <div>
        <label>
          Förnamn:
          <input type="text" value={firstName} onChange={handleFirstNameChange} />
          ({loggedInUser.first_name})
        </label>
        <button onClick={handleUpdateFirstName}>Uppdatera förnamn</button>
        <br />
        <label>
          Efternamn:
          <input type="text" value={lastName} onChange={handleLastNameChange} />
          ({loggedInUser.last_name})
        </label>
        <button onClick={handleUpdateLastName}>Uppdatera efternamn</button>
        <br />
        <label>
          Email:
          <input type="text" value={email} onChange={handleEmailChange} />
          ({loggedInUser.email})
        </label>
        <button onClick={handleUpdateEmail}>Uppdatera email</button>
        <br />
        <label>
          Mobilnummer:
          <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
          ({loggedInUser.phone_number})
        </label>
        <button onClick={handleUpdatePhoneNumber}>Uppdatera telefonnummer</button>
        <br />
        <label>
          Välj roll:
          <select value={role} onChange={handleRoleChange} >
            <option value=""></option>
            <option value="ppu">PPU</option>
            <option value="ppm">PPM</option>
          </select>
          ({loggedInUser.role})
        </label>
        <button onClick={handleUpdateRole}>Uppdatera roll</button>
      </div>
    </div>
  );
};

export default UpdateProfile
