import UsersAdmin from '../components/UsersAdmin';
import 'leaflet/dist/leaflet.css';
import SignedInUser from '../components/SignedInUser';
import React from 'react';

const Users_View = () => {
  let user = SignedInUser();

  return (
    <div>
      <h1>Hantera Användare:</h1>
      {user.role === "admin" ? (
        <UsersAdmin />
      ) : (
        <h3>Du måste vara inloggad som admin för besöka sidan!</h3>
      )}
    </div>
  );
};

export default Users_View;
