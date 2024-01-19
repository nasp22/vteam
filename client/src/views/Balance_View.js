import Balance from '../components/Balance';
import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';

const Balance_View = () => {

  return (
    <div>
      <h1>Saldo</h1>
        <Balance/>
    </div>
  );
};

export default withAuthenticationRequired(Balance_View, {
  onRedirecting: () => <Loading />,
});