import UpdateProfile from '../components/UpdateProfile';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';

const Update_Profile_View = () => {

  return (
    <div>
      <UpdateProfile/>
    </div>
  );
};

export default withAuthenticationRequired(Update_Profile_View, {
  onRedirecting: () => <Loading />,
});
