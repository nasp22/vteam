import { useEffect, useState } from 'react';
import { putData } from '../PUT_request';
import { fetchData } from '../GET_request';
import { delData } from '../DEL_request';



const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    status: '',
  });

  useEffect(() => {
    const fetchDataFromAPIusers = async () => {
      const result = await fetchData('user');
      setUsers(result.data);
    };

    const fetchDataFromAPIuser = async () => {
      const result = await fetchData(`user/${selectedUserId}`);
      setSelectedUser(result.data);
      setEditedUserData(result.data);
    };

    fetchDataFromAPIusers();
    fetchDataFromAPIuser();
  }, [selectedUserId]);

  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  const handleDelButton = async () => {

    const userConfirmed = window.confirm(`Är du säker på att du vill radera användaren ${selectedUserId} ?`);

    if (userConfirmed) {
      try {
        await delData('user', selectedUserId);
        console.log('User deleted successfully');

        // Återställ användare
        setUsers(users.filter(user => user._id !== selectedUserId));
        setSelectedUserId('');
        setSelectedUser('');

      } catch (error) {
        console.error('Error deleting user:', error.message);
      }
    } else {
      console.log('User deletion canceled');
    }
  };

  const handleEditButton = () => {
    setIsEditing(true);
  };

  const handleSaveButton = async () => {
    try {
      await putData('user', selectedUserId, editedUserData);
      alert("User updated successfully")
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  const handleCancelEditButton = () => {
    setIsEditing(false);
    setEditedUserData(selectedUser);
  };

  const handleInputChange = (event) => {
    setEditedUserData({
      ...editedUserData,
      [event.target.name]: event.target.value,
    });
  };

  const roleOptions = ['ppu', 'ppm', 'admin'];
  const statusOptions = ['active', 'inactive'];

  return (
    <div>
      <label htmlFor="userSelect">Välj en användare i listan:</label>
      <br />
      <select id="userSelect" onChange={handleUserChange} value={selectedUserId}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user._id}: {user.last_name} {user.first_name}
          </option>
        ))}
      </select>

      {selectedUserId && (
        <div className="view_div">
          <h3>
          {selectedUser.first_name} {selectedUser.last_name} - {selectedUser.status}
          </h3>
          <p>Status: {selectedUser.status}</p>
          <p>Id: {selectedUser._id}</p>
          <p>Roll:{selectedUser.role}</p>
          <p>Telefon: {selectedUser.phone_number}</p>
          <p>Epost: {selectedUser.email}</p>
          <p>Saldo: {selectedUser.credit_amount}</p>
          <a>logg:
          {selectedUser.log !== undefined ? (
              <ul>
                {selectedUser.log.map((logItem, index) => (
                  <li key={index}>{logItem}</li>
                ))}
              </ul>
            ) : (
              "none"
            )}
            </a>

          {isEditing ? (
            <div className = "edit_div">
              <label htmlFor="firstname">Förnamn:</label>
              <input
                type="text"
                name="first_name"
                value={editedUserData.first_name}
                onChange={handleInputChange}
              />
              <br />
              <label htmlFor="lastname">Efternamn:</label>
              <input
                type="text"
                name="last_name"
                value={editedUserData.last_name}
                onChange={handleInputChange}
              />
              <br />
              <label htmlFor="email">Epost:</label>
              <input
                type="text"
                name="email"
                value={editedUserData.email}
                onChange={handleInputChange}
              />
              <br />
              <label htmlFor="phone_number">Telefon:</label>
              <input
                type="text"
                name="phone_number"
                value={editedUserData.phone_number}
                onChange={handleInputChange}
              />
              <br />
              <label htmlFor="role">Roll:</label>
              <select
                name="role"
                value={editedUserData.role}
                onChange={handleInputChange}
              >
                <option value="">Välj en roll</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="status">Status:</label>
              <select
                name="status"
                value={editedUserData.status}
                onChange={handleInputChange}
              >
                <option value="">Välj en status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <br />
              <button onClick={handleSaveButton}>Spara</button>
              <button onClick={handleCancelEditButton}>Avbryt</button>
            </div>
          ) : (
            <div>
              <button onClick={handleEditButton}>Uppdatera kund</button>
              <button className="delete-button" onClick={handleDelButton}>Radera kund</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
