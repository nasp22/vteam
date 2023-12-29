
import React from 'react';
import MapComponentCity from '../components/MapComponentCity';
import SignedInUser from '../components/SignedInUser';
const Map_City_View = () => {
  let user = SignedInUser();
  return (
    <>
        { user.role === "admin" ? (
      <MapComponentCity/>
      ) : (
        <h3>Du måste vara inloggad som admin för att se detta! </h3>
      )}
    </>
  );
};

export default Map_City_View;
