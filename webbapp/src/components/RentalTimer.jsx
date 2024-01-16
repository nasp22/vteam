import React, { useEffect, useState } from 'react';

const RentalTimer = ({ onEndRental, onUpdateTime }) => {
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(new Date().getTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
      onUpdateTime(seconds + 1); // Notify parent component about updated time
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds, onUpdateTime]);

  const handleEndRental = () => {
    clearInterval();
    const endTime = new Date().getTime();
    onEndRental(endTime - startTime); // Notify parent component about total time
  };

  return (
    <div>
      {/* <h3>Hyrd tid: {formatTime(seconds)}</h3> */}
      <button className="end_rental_button" onClick={handleEndRental}>
        Avsluta hyrperioden
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
