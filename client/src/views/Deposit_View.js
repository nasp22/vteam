import Deposit from '../components/Deposit';
import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from '../components/Loading';


const Deposit_View = () => {
  return (
    <>
    <div>
      <Deposit/>
    </div>
    </>
  );
}

export default withAuthenticationRequired(Deposit_View, {
  onRedirecting: () => <Loading />,
});
