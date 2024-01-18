import 'leaflet/dist/leaflet.css';
import MapComponentCities from '../components/MapComponentCities';
import SignedInUser from '../components/SignedInUser';
import { withAuthenticationRequired } from "@auth0/auth0-react";

const Map_Cities_View = () => {
  let user = SignedInUser();
  return (
    <>
    { user.role === "admin" ? (
        <MapComponentCities/>
      ) : (
        <h3>Du måste vara inloggad som admin för att se detta! </h3>
      )}
    </>
  );
};

export default withAuthenticationRequired(Map_Cities_View);
