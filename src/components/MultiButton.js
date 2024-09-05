import React from 'react';

function MultiButton() {
  const handleOptions = () => {
    console.log('Options button clicked');
  };

  return (
    <button onClick={handleOptions}>
      Multiplayer
    </button>
  );
}

export default MultiButton;
