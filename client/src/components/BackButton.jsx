import React from 'react';

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button onClick={handleBack}>Tillbaka</button>
  );
};

export default BackButton;
