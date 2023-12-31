import Log from '../components/Log';
import SignedInUser from '../components/SignedInUser';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';

const Log_View = () => {
  let user = SignedInUser();

    return (
      <>
      <div>
        <Log/>
      </div>
      </>
    );
  };

export default withAuthenticationRequired(Log_View, {
    onRedirecting: () => <Loading />,
  });
