import Log from '../components/Log';
import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';

const Log_View = () => {

  return (
    <div>
      <h1>Reselogg</h1>
      <Log/>
    </div>
  );
};

export default withAuthenticationRequired(Log_View, {
  onRedirecting: () => <Loading />,
});
