import Profile from '../components/Profile';
import { withAuthenticationRequired } from "@auth0/auth0-react";

const Profile_View = () => {

  return (
    <div>
      <Profile/>
    </div>
  );
};

export default withAuthenticationRequired(Profile_View);
