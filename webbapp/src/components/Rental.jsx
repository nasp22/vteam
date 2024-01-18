import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../GET_request'
import { putData } from '../PUT_request'
import { postData } from '../POST_request'
import SignedInUser from './SignedInUser';
import RentalTimer from './RentalTimer';
import * as L from 'leaflet';

const Rental = () => {
  const [scooter, setScooter] = useState(null);
  const [rental, setRental] = useState(null);
  const [rentalID, setRentalID] = useState(null);
  const [rentalStarted, setRentalStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [scooterStatus, setScooterStatus] = useState('');
  const [scooterPosition, setScooterPosition] = useState('');
  const [sideTitle, setSideTitle] = useState('Påbörja uthyrning');
  const user = SignedInUser();
  const { scooterId } = useParams();
  const [totalTime, settotalTime] = useState(0)
  const costPerMinute = 2;
  const [stations, setStations] = useState();
  const [startFee, setStartFee] = useState(10);


  useEffect(() => {

    const fetchStations = async () => {
      const stationsFetch = await fetchData('station');
      setStations(stationsFetch.data);
    };

    const fetchScooterById = async () => {
      try {
        const scooterFetch = await fetchData(`scooter/${scooterId}`);
        setScooter(scooterFetch.data);
        setScooterStatus(scooterFetch.data.status);
        setScooterPosition(scooterFetch.data.position);
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

    const checkStartFee = async () => {
      const scooterPos = [scooterPosition.lat, scooterPosition.lng];
      const stationRadius = 50

    // Kolla om scootern är inom någon av cirklarna för stationerna
      const isInAnyStation = stations.some(station => {
        const stationPosition = [station.position.lat, station.position.lng];
        const distance = L.latLng(scooterPos).distanceTo(L.latLng(stationPosition));
        return distance <= stationRadius;
      });

      if (isInAnyStation) {
        setStartFee(5)
        await putData('rent', rental._id, { startfee: startFee });
      } else {
        setStartFee(10)
        await putData('rent', rental._id, { startfee: startFee });
      }
    }

    fetchStations()
    fetchScooterById();
    fetchRental();

    if (rental && scooter) {
      setSideTitle('Pågående uthyrning');
      checkStartFee();
    }

    const intervalId = setInterval(fetchScooterById, 1000);
    const intervalId2 = setInterval(checkStartFee, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
    };
  }, [scooterId, rentalID, startFee, scooterPosition]);

  const handleStartRental = async () => {
    try {
      // console.log('Rental started!');
      const startTime = new Date().toISOString();
      setRentalStarted(true);
      setStartTime(startTime);

      const newRental = {
        startfee: startFee,
        start_time: startTime || Date.now(),
      };

      const scooterUpdateResult = await putData('scooter', scooterId, { id_: scooterId, status: 1002 });
      // console.log('Scooter status changed to rented:', scooterUpdateResult);

      const rentalResult = await postData(`rent/${scooterId}/${user._id}`, newRental);
      setRentalID(rentalResult.data._id);
      console.log('Rental created successfully:', rentalResult);
    } catch (error) {
      console.error('Error starting rental:', error);
    }
  };

  const handleEndRental = async (totalTime) => {
    // console.log('Rental ended!');

    setRentalStarted(false);

    const endTime = new Date().toISOString();
    setEndTime(endTime);
    setSideTitle('Hyr denna scooter igen?');

    const PUTrental = {
      end_time: endTime || Date.now(),
    };

    await putData('rent', rental._id, PUTrental);

    settotalTime(rental.start_time - rental.end_time)
    // console.log('Rental ended successfully:', rental);

    const calc = startFee + ((totalTime / 1000 / 60)+1) * costPerMinute;

    console.log('Total hyrtid (minuter):', Math.round(totalTime / 1000 / 60));

    const totalCost = Math.round(calc, 2);

  const scooterUpdateResult = await putData('scooter', scooterId, { id_: scooterId, status: 1001 });
  // console.log('Scooter status changed to ready:', scooterUpdateResult);
  // console.log(rental)

  const updatedCreditAmount = user.credit_amount - totalCost;

  // if ppu
  if (user.role === 'ppu') {
    if (totalCost <= user.credit_amount) {
      await putData('user', user._id, {
        credit_amount: updatedCreditAmount,
      });
      await putData('rent', rental._id, { cost: totalCost, payed: true });
    } else {
        await putData('rent', rental._id, { cost: totalCost, payed: false });
    }
  }

  // If ppm
  if (user.role === 'ppm') {
    await putData('rent', rental._id, { startfee: 0, cost: 0, payed: true });
  }

  await putData('scooter', rental.scooter_id, { status: 1001 });

}

  const handleUpdateTime = (updatedTime) => {
    // console.log('Updated rental time:', updatedTime);
  };

  return (
    <div className="rental_div" style={{ textAlign: 'center', marginTop: '50px' }}>
      {scooter && (
        <>
          {!rentalStarted && user.credit_amount > 0 && (
            <button className="rent_button" onClick={handleStartRental}>
              Starta
            </button>
          )}
          <h4>Startavgift: {startFee} </h4>
          <h2>Elscooter Status: {scooterStatus || scooter.status}</h2>
          <h2>Elscooter Id: {scooter._id}</h2>
          <h4>Saldo: {user.credit_amount !== null ? user.credit_amount : 0}</h4>
          {!rentalStarted && user.credit_amount <= 0 && (
            <>
              <p>User Balance: {user.credit_amount !== null ? user.credit_amount : 0}</p>,
              <a href="http://localhost:3000/profile">Sätt in pengar</a>
            </>
          )}
          {rentalStarted && <RentalTimer onEndRental={handleEndRental} onUpdateTime={handleUpdateTime} />}
        </>
      )}
    </div>
  );
};

export default Rental;
