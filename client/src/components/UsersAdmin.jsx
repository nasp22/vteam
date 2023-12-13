import { useEffect, useState } from 'react';
import { fetchData } from '../utils/GET_request';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchDataFromAPIusers = async () => {
      const result = await fetchData('user');
      setUsers(result.data.users);
    };

    const fetchDataFromAPIuser = async () => {
      const result = await fetchData(`user/${selectedUserId}`);
      setSelectedUser(result.message);
    };

    fetchDataFromAPIusers();
    fetchDataFromAPIuser();
  }, [selectedUserId]);

  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  return (
    <div>
      <h2>UserAdmin</h2>
      <label htmlFor="userSelect">Välj en användare i listan:</label><br></br>
      <select id="userSelect" onChange={handleUserChange} value={selectedUserId}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.id}: {user.last_name} {user.first_name}
          </option>
        ))}
      </select>

      {selectedUserId && (
        <div>
          <h3>Vald användare id: {selectedUserId}</h3>
          <p>...user/:id message = {selectedUser}</p>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin
