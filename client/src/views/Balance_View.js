import Balance from '../components/Balance';
import { withAuthenticationRequired } from "@auth0/auth0-react";

const Balance_View = () => {

  return (
    <div>
      <h1>Saldo</h1>
        <Balance/>
    </div>
  );
};

  export default withAuthenticationRequired(Balance_View);