import 'leaflet/dist/leaflet.css';
import MapComponentCities from '../components/MapComponentCities';
import SignedInUser from '../components/SignedInUser';

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

export default Map_Cities_View;
