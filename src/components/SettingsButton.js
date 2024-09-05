import React from 'react';

function SettingsButton() {
  const handleQuit = () => {
    console.log('Quit button clicked');
  };

  return (
    <button onClick={handleQuit}>
      Settings
    </button>
  );
}

export default SettingsButton;
