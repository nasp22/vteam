import StationsAdmin from '../components/StationsAdmin';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import SignedInUser from '../components/SignedInUser';


const Stations_View = () => {
  let user = SignedInUser();

  return (
    <div>
      <h1>Hantera Stationer:</h1>
      {user.role === "admin" ? (
        <StationsAdmin/>
      ) : (
        <h3>Du måste vara inloggad som admin för besöka sidan!</h3>
      )}
    </div>
  );
};

export default Stations_View;
