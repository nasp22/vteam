import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../GET_request'
import { putData } from '../PUT_request'
import { postData } from '../POST_request'
import SignedInUser from './SignedInUser';
import BackButton from './BackButton';
import RentalTimer from './RentalTimer';

const Rental = () => {
  const [scooter, setScooter] = useState(null);
  const [rental, setRental] = useState(null);
  const [rentalID, setRentalID] = useState(null);
  const [rentalStarted, setRentalStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [scooterStatus, setScooterStatus] = useState('');
  const [sideTitle, setSideTitle] = useState('Påbörja uthyrning');
  const user = SignedInUser();
  const { scooterId } = useParams();
  const startFee = 10;
  const costPerMinute = 2;

  useEffect(() => {
    const fetchScooterById = async () => {
      try {
        const scooterFetch = await fetchData(`scooter/${scooterId}`);
        setScooter(scooterFetch.data);
        setScooterStatus(scooterFetch.data.status);
      } catch (error) {
        console.error('Error fetching scooter:', error);
      }
    };

    const fetchRental = async () => {
      try {
        const rentalFetch = await fetchData(`rent/${rentalID}`);
        setRental(rentalFetch.data);
      } catch (error) {
        console.error('Error fetching rental:', error);
      }
    };

    fetchScooterById();
    fetchRental();
    if (rentalID) {
      setSideTitle('Pågående uthyrning');
    }

    const intervalId = setInterval(fetchScooterById, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [scooterId, rentalID]);

  const handleStartRental = async () => {
    try {
      console.log('Rental started!');
      const startTime = new Date().toISOString();
      setRentalStarted(true);
      setStartTime(startTime);

      const newRental = {
        startfee: startFee,
        start_time: startTime || Date.now(),
      };

      const scooterUpdateResult = await putData('scooter', scooterId, { id_: scooterId, status: 1002 });
      console.log('Scooter status changed to rented:', scooterUpdateResult);

      const rentalResult = await postData(`rent/${scooterId}/${user._id}`, newRental);
      setRentalID(rentalResult.data._id);
      console.log('Rental created successfully:', rentalResult);
    } catch (error) {
      console.error('Error starting rental:', error);
    }
  };

  const handleEndRental = async (totalTime) => {
    console.log('Rental ended!');
    setRentalStarted(false);
    setEndTime(new Date().getTime());
    setSideTitle('Hyr igen');

    const PUTrental = {
      "end_time": endTime | new Date().getTime()
    };

    // StartFee = 0kr om parking inom zooner.

    const rental = await putData('rent', rentalID, PUTrental);
    console.log('Rental ended successfully:', rental);

    const calc = startFee + (totalTime / 1000 / 60) * costPerMinute;

    console.log('Total hyrtid (minuter):', Math.round(totalTime / 1000 / 60));

    const totalCost = Math.round(calc, 2);

  if (user.role === 'ppu') {
    const updatedCreditAmount = user.credit_amount - totalCost;
    const userUpdateResult = await putData('user', user._id, {
      credit_amount: updatedCreditAmount,
    });

    console.log('User credit amount updated:', userUpdateResult);
  }

    // Om user.role === ppm: dra inte av något

    // Uppdatera saldo på rent
    // await putData('rent', rentalID, PUTrental);
    // console.log('Rental ended successfully:', rental);

    // Uppdatera payed Y/N på /rent

    const scooterUpdateResult = await putData('scooter', scooterId, { id_: scooterId, status: 1001 });
    console.log('Scooter status changed to ready:', scooterUpdateResult);
  };

  const handleUpdateTime = (updatedTime) => {
    console.log('Updated rental time:', updatedTime);
  };

  return (
    <div className="rental_div" style={{ textAlign: 'center', marginTop: '50px' }}>
      {scooter && (
        <>
          <BackButton />
          <h1>{sideTitle}</h1>
          {rental ? (
            <>
              <h2>Hyrnings-ID: {rental._id}</h2>
            </>
          ) : null}
          <h2>Scooter Status: {scooterStatus || scooter.status}</h2>
          <h2>Scooter Id: {scooter._id}</h2>
          <p>User Balance: {user.credit_amount !== null ? user.credit_amount : 'Laddar värde...'}</p>,
          {!rentalStarted && user.credit_amount >=50 && (
            <button className="rent_button" onClick={handleStartRental}>
              Starta
            </button>
          )}
          {!rentalStarted && user.credit_amount <=50 && (
            <p>User Balance: {user.credit_amount !== null ? user.credit_amount : 'Laddar värde...'}</p>,
            <a href="http://localhost:3000/profile">
            Sätt in pengar
          </a>
          )}
          {rentalStarted && <RentalTimer onEndRental={handleEndRental} onUpdateTime={handleUpdateTime} />}
        </>
      )}
    </div>
  );
};

export default Rental;
