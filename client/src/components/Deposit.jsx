import { useState } from 'react';
import SignedInUser from "./SignedInUser";
import { useHistory } from 'react-router-dom';
import {putData} from '../PUT_request';

const Deposit = () => {
  const user = SignedInUser();
  const history = useHistory();
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleUpdateBalance = async () => {
    const newCreditAmount = +user.credit_amount + +selectedOption;

    // uppdatera credit_amount via PUT
    await putData('user', user._id, { credit_amount: newCreditAmount });

    // redirect till /amount
    history.push('/balance');
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
