import Deposit from '../components/Deposit';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';

const Deposit_View = () => {
<<<<<<< HEAD
=======

    return (
      <div>
        <Deposit/>
      </div>
    );
  };
>>>>>>> 89447c1d0900adf5462b4eec9c5b953bda5f9783

  return (
    <div>
      <Deposit/>
    </div>
  );
};

export default withAuthenticationRequired(Deposit_View, {
  onRedirecting: () => <Loading />,
});