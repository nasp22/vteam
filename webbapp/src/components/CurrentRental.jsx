import React, { useEffect, useState } from 'react';
import { fetchData } from '../GET_request';
import SignedInUser from './SignedInUser';
import { putData } from '../PUT_request';
import * as L from 'leaflet';

const CurrentRental = () => {
  const [rentals, setRentals] = useState([]);
  const [rental, setRental] = useState({});
  const user = SignedInUser();
  const [rentalID, setRentalID] = useState();
  const [endTime, setEndTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const costPerMinute = 2;
  const [startFee, setStartFee] = useState(10)
  const [stations, setStations] = useState();;
  const [scooterPosition, setScooterPosition] = useState('');

  useEffect(() => {
    const fetchDataAndCheckStartFee = async () => {
      try {
        // Fetch rentals
        const rentalFetch = await fetchData(`rent`);
        setRentals(rentalFetch.data);

        // Fetch stations
        const stationsFetch = await fetchData('station');
        setStations(stationsFetch.data);

        // Fetch rental details
        if (rentalID) {
          const rentalDetailsFetch = await fetchData(`rent/${rental._id}`);
          setRental(rentalDetailsFetch.data);

          // Fetch scooter details
          const scooterFetch = await fetchData(`scooter/${rentalDetailsFetch.data.scooter_id}`);
          setScooterPosition(scooterFetch.data.position);

          // Check start fee based on scooter position and stations
          const scooterPos = [scooterFetch.data.position.lat, scooterFetch.data.position.lng];
          const stationRadius = 50;

          const isInAnyStation = stations.some(station => {
            const stationPosition = [station.position.lat, station.position.lng];
            const distance = L.latLng(scooterPos).distanceTo(L.latLng(stationPosition));
            return distance <= stationRadius;
          });

          if (isInAnyStation) {
            setStartFee(5);
            await putData('rent', rentalID, { startfee: 5 });
          } else {
            setStartFee(10);
            await putData('rent', rentalID, { startfee: 10 });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndCheckStartFee();

    const intervalId = setInterval(fetchDataAndCheckStartFee, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [rentalID, startFee]);

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

    const updatedTotalTime = calculateRentalTime(currentrental.start_time)
    setTotalTime(updatedTotalTime);

    const calc = startFee + totalTime * costPerMinute;

    const totalCost = Math.round(calc, 2);

    if (totalCost !== null && totalCost !== undefined) {
      const updatedCreditAmount = user.credit_amount - totalCost;

      // if ppu
      if (user.role === 'ppu') {
        if (totalCost <= user.credit_amount) {
          await putData('user', user._id, {
            credit_amount: updatedCreditAmount,
          });
          await putData('rent', currentrental._id, { cost: totalCost, payed: true });
        } else {
          await putData('rent', currentrental._id, { cost: totalCost, payed: false });
        }
      }

      // If ppm
      if (user.role === 'ppm') {
        await putData('rent', currentrental._id, { startfee: 0, cost: 0, payed: true });
      }
    }

    await putData('scooter', currentrental.scooter_id, { status: 1001 });
  };

  const showRentals = () => {
    const ongoingRentals = rentals.filter((rental) => !rental.end_time);

    // console.log('Ongoing Rentals:', ongoingRentals);

    return ongoingRentals.length > 0 ? (
      <ul>
        {ongoingRentals.map((currentrental) => (
          <div>
            <h2>Pågående uthyrning</h2>
            <h4>id: {currentrental._id}</h4>
            <h4>Starttid: {currentrental.start_time}</h4>
            <h4>Startkostnad: {currentrental.startfee}</h4>
            <h4>Total kostnad: {rental.cost}</h4>
            <button onClick={() => handleEndRental(currentrental)}>
              Avsluta hyrperioden
            </button>
          </div>
        ))}
      </ul>
    ) : (
      <div>

        <h2>Inga pågående</h2>
      </div>
    );
  };

  return <div className="rental_div">{showRentals()}</div>;
};

export default CurrentRental;
