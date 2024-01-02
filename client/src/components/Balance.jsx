import { Link } from 'react-router-dom';
import SignedInUser from "./SignedInUser";

const Balance = () => {
  const user = SignedInUser();
  console.log(user);

  return (
    <div>
      <h2>Saldo</h2>
      <p>{user.credit_amount} kr</p>
      <Link to="/deposit">
        <button>Insättning</button>
      </Link>
      <Link to="/subscribe">
        <button>Ändra roll</button>
      </Link>
    </div>
  );
};

export default Balance
