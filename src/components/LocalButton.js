import React from 'react';

function LocalButton() {
  const handlePlay = () => {
    console.log('Play button clicked');
  };

  return (
    <button onClick={handlePlay}>
      Jouer
    </button>
  );
}

export default LocalButton;
