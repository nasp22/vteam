import { useState, useEffect } from 'react';
import SignedInUser from "./SignedInUser";
import { useHistory } from 'react-router-dom';
// import {putData} from '../PUT_request';

const Deposit = () => {
  const user = SignedInUser();
  const history = useHistory();
  const [selectedOption, setSelectedOption] = useState('');
  const [updatedBalance, setUpdatedBalance] = useState(null);

  const handleOptionChange = (event) => {
    console.log(event.target.value)
    setSelectedOption(event.target.value);
  };


  const handleUpdateBalance = async () => {
    const newBalance = +user.credit_amount + +selectedOption;
    console.log(newBalance)
    console.log('Deposit button pressed')

    // uppdatera api via PUT
    // await updateData('user', { balance: newBalance }); typ så?

    //setUpdatedBalance(newBalance);

    // redirect till /amount
    history.push('/amount');
  };

  return (
    <div>
      <div>
        <label>
          Välj belopp:
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="100">100 kr</option>
            <option value="200">200 kr</option>
            <option value="300">300 kr</option>
            <option value="400">400 kr</option>
            <option value="500">500 kr</option>
          </select>
        </label>
      </div>
      <div>
        <button onClick={handleUpdateBalance}>Bekräfta insättning</button>
      </div>
    </div>
  );
};

export default Deposit
