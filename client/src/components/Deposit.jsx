import React from "react";
import { useState } from 'react';
import React from "react";
import SignedInUser from "./SignedInUser";
import { useHistory } from 'react-router-dom';
import {putData} from '../PUT_request';
import '../style/Deposit.css'

const Deposit = () => {
  const loggedInUser = SignedInUser();
  const history = useHistory();
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleUpdateBalance = async () => {
    const isConfirmed = window.confirm('Är du säker på ditt val?');

    if (isConfirmed) {
    const newCreditAmount = +loggedInUser.credit_amount + +selectedOption;
    await putData('user', loggedInUser._id, { credit_amount: newCreditAmount });
    history.push('/balance');
    }
  };

  return (
    <div className="deposit-container">
      <div className="deposit-form-container">
        <label className="deposit-label">
          Välj belopp
          <select className="deposit-select" value={selectedOption} onChange={handleOptionChange}>
            <option value="0"></option>
            <option value="100">100 kr</option>
            <option value="200">200 kr</option>
            <option value="300">300 kr</option>
            <option value="400">400 kr</option>
            <option value="500">500 kr</option>
            <option value="600">600 kr</option>
            <option value="700">700 kr</option>
            <option value="800">800 kr</option>
            <option value="900">900 kr</option>
            <option value="1000">1000 kr</option>
          </select>
          <button className="green-button" onClick={handleUpdateBalance}>Bekräfta</button>
        </label>
      </div>
    </div>
  );
};

export default Deposit
