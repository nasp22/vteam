import ScootersAdmin from '../components/ScootersAdmin';
import 'leaflet/dist/leaflet.css';
import SignedInUser from '../components/SignedInUser';

const Scooters_View = () => {
  let user = SignedInUser();
  return (
    <div>
      <h1>Hantera El-scootrar</h1>
      {user.role === "admin" ? (
        <ScootersAdmin/>
      ) : (
        <h3>Du måste vara inloggad som admin för besöka sidan!</h3>
      )}
    </div>
  );
};

export default Scooters_View;
