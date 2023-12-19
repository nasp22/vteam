import { useEffect, useState } from 'react';
import { fetchData } from '../utils/GET_request';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchDataFromAPIusers = async () => {
      const result = await fetchData('user');
      setUsers(result.data);
    };

    const fetchDataFromAPIuser = async () => {
      const result = await fetchData(`user/${selectedUserId}`);
      setSelectedUser(result.data);
    };

    fetchDataFromAPIusers();
    fetchDataFromAPIuser();
  }, [selectedUserId]);

  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  const handleDelButton = async () => {

    console.log("Delete button clicked");
  };

  const handleEditButton = async () => {

    console.log("Edit button clicked");
  };

  return (
    <div>
      <h2>UserAdmin</h2>
      <label htmlFor="userSelect">Välj en användare i listan:</label><br></br>
      <select id="userSelect" onChange={handleUserChange} value={selectedUserId}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user._id}: {user.last_name} {user.first_name}
          </option>
        ))}
      </select>

      {selectedUserId && (
        <div>
          <h3>Vald användare id: {selectedUser.first_name}  {selectedUser.last_name}</h3>
          <p>Id: = {selectedUser._id}</p>
          <p>epost: = {selectedUser.email}</p>
          <button onClick={handleDelButton}> Delete</button>
          <button onClick={handleEditButton}> Edit</button>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin
