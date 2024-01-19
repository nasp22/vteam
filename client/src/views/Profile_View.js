import Profile from '../components/Profile';
import React from 'react';
import Loading from '../components/Loading';
import { withAuthenticationRequired } from "@auth0/auth0-react";

const Profile_View = () => {

  return (
    <div>
      <Profile/>
    </div>
  );
};

export default withAuthenticationRequired(Profile_View, {
  onRedirecting: () => <Loading />,
});