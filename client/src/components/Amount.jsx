import { Link } from 'react-router-dom';
import SignedInUser from "./SignedInUser";

const Amount = () => {
  const user = SignedInUser();

  return (
    <div>
      <h2>Saldo</h2>
      <p>{user.credit_amount} kr</p>
      <Link to="/deposit">
        <button>Insättning</button>
      </Link>
    </div>
  );
};

export default Amount
