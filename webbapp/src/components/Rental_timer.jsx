import React, { useEffect, useState } from 'react';

const RentalTimer = ({ onEndRental }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleEndRental = () => {
    clearInterval();
    onEndRental();
  };

  return (
    <div>
      <button className="end_rental_button" onClick={handleEndRental}>
        Avsluta
      </button>
    </div>
  );
};


const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours > 0 ? hours + 'h ' : ''}${minutes}min ${seconds}s`;
};

export default RentalTimer;