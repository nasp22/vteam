import React, { useEffect, useState } from 'react';
import { fetchData } from '../GET_request';
import SignedInUser from './SignedInUser';
import { putData } from '../PUT_request';

const CurrentRental = () => {
  const [rentals, setRentals] = useState([]);
  const [rental, setRental] = useState({});
  const user = SignedInUser();
  const [rentalID, setRentalID] = useState();
  const [endTime, setEndTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const costPerMinute = 2;
  const startFee = 10;

  const fetchRental = async () => {
    try {
      const rentalFetch = await fetchData(`rent/${rentalID}`);
      setRental(rentalFetch.data);
    } catch (error) {
      console.error('Error fetching rental:', error);
    }
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const rentalFetch = await fetchData(`rent`);
        setRentals(rentalFetch.data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    fetchRentals();
    showRentals()
  }, [rentalID]);

  useEffect(() => {
    if (rentalID) {
      fetchRental();
    }
  }, [rentalID]);

  const calculateRentalTime = (startTime) => {
    const startTimestamp = new Date(startTime).getTime();
    const currentTimestamp = new Date().getTime();

    const timeDifference = currentTimestamp - startTimestamp;

    const rentalTimeInMinutes = timeDifference / (1000 * 60);

    return rentalTimeInMinutes;
  };


  const handleEndRental = async (currentrental) => {

    const endTime = new Date().toISOString();
    setEndTime(endTime);


    if (!currentrental) {
      console.error('Rental data is not available');
      return;
    }

    const PUTrental = {
      end_time: endTime || Date.now(),
    };

    await putData('rent', currentrental._id, PUTrental);

    const updatedRentalsFetch = await fetchData('rent');
    setRentals(updatedRentalsFetch.data);

    console.log(currentrental.start_time)
    console.log(endTime)

    const updatedTotalTime = calculateRentalTime(currentrental.start_time)
    setTotalTime(updatedTotalTime);

    console.log(totalTime)

    const calc = startFee + totalTime * costPerMinute;

    console.log(calc);

    const totalCost = Math.round(calc, 2);
    console.log(totalCost)


    if (user.role === 'ppu') {
      const updatedCreditAmount = user.credit_amount - totalCost;
      const userUpdateResult = await putData('user', user._id, {
        credit_amount: updatedCreditAmount,
      });

      console.log('User credit amount updated:', userUpdateResult);
    }

    const scooterUpdateResult = await putData('scooter', currentrental.scooter_id, { id_: currentrental.scooter_id, status: 1001 });
    console.log('Scooter status changed to ready:', scooterUpdateResult);
  };

  const showRentals = () => {
    const ongoingRentals = rentals.filter((r) => !r.end_time);

    console.log('Ongoing Rentals:', ongoingRentals);

    return ongoingRentals.length > 0 ? (
      <ul>
        {ongoingRentals.map((currentrental) => (
          <li key={currentrental._id}>
            <h1>Pågående uthyrning</h1>
            <h2>id: {currentrental._id}</h2>
            <h2>Starttid: {currentrental.start_time}</h2>
            <button onClick={() => handleEndRental(currentrental)}>
              Avsluta hyrperioden
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p>Inga pågående uthyrningar</p>
    );
  };

  return <div className="rental_div">{showRentals()}</div>;
};

export default CurrentRental;
