import React from "react";
import { Link } from 'react-router-dom';
import SignedInUser from "./SignedInUser";
import '../style/Balance.css'

const Balance = () => {
  const loggedInUser = SignedInUser();

  return (
    <div>
      <p className="lead text-muted balance-text">{loggedInUser.credit_amount} kr</p>
      <Link to="/deposit">
        <button className="blue-button">Insättning</button>
      </Link>
    </div>
  );
};

export default Balance
