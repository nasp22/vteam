import React, { useEffect, useState } from 'react';
import { fetchData } from '../GET_request';
import SignedInUser from './SignedInUser';
import { putData } from '../PUT_request';

const CurrentRental = () => {
  const [rentals, setRentals] = useState([]);
  const [rental, setRental] = useState({});
  const user = SignedInUser();
  const [rentalID, setRentalID] = useState();

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
  }, [rentalID]);

  useEffect(() => {
    if (rentalID) {
      fetchRental();
    }
  }, [rentalID]);

  const handleEndRental = async (rentalID, endTime, scooterId) => {
    console.log('Rental ended!');
    console.log(scooterId);
    console.log(rentalID);
    console.log(endTime);

    const PUTrental = {
      end_time: endTime || new Date().getTime(),
    };

    await putData('rent', rentalID, PUTrental);

    const updatedRentals = rentals.map((r) =>
      r._id === rentalID ? { ...r, end_time: PUTrental.end_time } : r
    );
    setRentals(updatedRentals);

    const scooterUpdateResult = await putData('scooter', scooterId, {
        id_: rental.scooter_id,
        status: 1001,
      });
      console.log('Scooter status changed to ready:', scooterUpdateResult);

  };

  const showRentals = () => {
    const ongoingRentals = rentals.filter((r) => !r.end_time);

    return ongoingRentals.length > 0 ? (
      <ul>
        {ongoingRentals.map((r) => (
          <li key={r._id}>
            <h1>Pågående uthyrning</h1>
            <h2>id: {r._id}</h2>
            <h2>Starttid: {r.start_time}</h2>
            <button onClick={() => handleEndRental(r._id, new Date().getTime(), r.scooter_id)}>
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
