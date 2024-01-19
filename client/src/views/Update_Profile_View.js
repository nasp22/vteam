import UpdateProfile from '../components/UpdateProfile';
import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';

const Update_Profile_View = () => {

  return (
    <div>
      <h1>Uppdatera profil</h1>
      <UpdateProfile/>
    </div>
  );
};

export default withAuthenticationRequired(Update_Profile_View, {
  onRedirecting: () => <Loading />,
});
