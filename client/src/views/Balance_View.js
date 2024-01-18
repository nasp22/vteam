import Balance from '../components/Balance';
import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";

const Balance_View = () => {

  return (
    <>
      <h1>Saldo</h1>
        <Balance/>
    </>
  );
};

  export default withAuthenticationRequired(Balance_View);