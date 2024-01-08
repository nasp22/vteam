import Balance from '../components/Balance';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';

const Balance_View = () => {

  return (
    <div>
        <Balance/>
    </div>
  );
};

  export default withAuthenticationRequired(Balance_View, {
    onRedirecting: () => <Loading />,
  });