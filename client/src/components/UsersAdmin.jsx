import { useEffect, useState } from 'react';
import { putData } from '../PUT_request';
import { fetchData } from '../GET_request';
import { delData } from '../DEL_request';
import '../style/UsersAdmin.css';
import '../style/Buttons.css';



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
      <div className="users-admin-start-container">
        <label className="users-admin-label" htmlFor="userSelect">Välj en användare
          <select id="userSelect" className="users-admin-select" onChange={handleUserChange} value={selectedUserId}>
            <option value=""></option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user._id}: {user.last_name} {user.first_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedUserId && (
        <div>
          <div className="users-admin-table-container">
            <h3>
            {selectedUser.first_name} {selectedUser.last_name}
            </h3>
            <table className="users-admin-table">
              <thead>
                <tr className="users-admin-tr">
                  <th className="users-admin-th">Status</th>
                  <th className="users-admin-th">ID</th>
                  <th className="users-admin-th">Roll</th>
                  <th className="users-admin-th">Telefon</th>
                  <th className="users-admin-th">Email</th>
                  <th className="users-admin-th">Saldo</th>
                  <th className="users-admin-th">Reselogg</th>
                </tr>
              </thead>
              <tbody>
                <tr className="users-admin-tr">
                  <td className="users-admin-td">{selectedUser.status}</td>
                  <td className="users-admin-td">{selectedUser._id}</td>
                  <td className="users-admin-td">{selectedUser.role}</td>
                  <td className="users-admin-td">{selectedUser.phone_number}</td>
                  <td className="users-admin-td">{selectedUser.email}</td>
                  <td className="users-admin-td">{selectedUser.credit_amount}</td>
                  <td className="users-admin-td">
                  {selectedUser.log !== undefined ? (
                      <ul>
                        {selectedUser.log.map((logItem, index) => (
                          <li key={index}>{logItem}</li>
                        ))}
                      </ul>
                    ) : (
                      "none"
                    )}
                    </td>
                </tr>
              </tbody>
            </table>
          </div>

          {isEditing ? (
            <div className="users-admin-edit-container">
              <label className="users-admin-label">Förnamn
                <input
                  className="users-admin-input"
                  type="text"
                  name="first_name"
                  value={editedUserData.first_name}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label className="users-admin-label">Efternamn
                <input
                  className="users-admin-input"
                  type="text"
                  name="last_name"
                  value={editedUserData.last_name}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label className="users-admin-label">Epost
                <input
                  className="users-admin-input"
                  type="text"
                  name="email"
                  value={editedUserData.email}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label className="users-admin-label">Telefon
                <input
                  className="users-admin-input"
                  type="text"
                  name="phone_number"
                  value={editedUserData.phone_number}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label className="users-admin-label">Roll
                <select
                  className="users-admin-select"
                  name="role"
                  value={editedUserData.role}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label className="users-admin-label">Status
                <select
                  className="users-admin-select"
                  name="status"
                  value={editedUserData.status}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
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
              <button className="green-button" onClick={handleEditButton}>Uppdatera kund</button>
              <button className="red-button" onClick={handleDelButton}>Radera kund</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
