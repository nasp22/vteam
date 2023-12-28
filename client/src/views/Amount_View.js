import Amount from '../components/Amount';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';


const Amount_View = () => {
    return (
      <div>
        <Amount/>
      </div>
    );
  };

  export default withAuthenticationRequired(Amount_View, {
    onRedirecting: () => <Loading />,
  });