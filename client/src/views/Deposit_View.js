import Deposit from '../components/Deposit';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';

  return (
    <div>
      <Deposit/>
    </div>
  );
};

export default withAuthenticationRequired(Deposit_View, {
  onRedirecting: () => <Loading />,
});
