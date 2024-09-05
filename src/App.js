import React from 'react';
import LocalButton from './components/LocalButton';
import MultiButton from './components/MultiButton';
import SettingsButton from './components/SettingsButton';

function App() {
  return (
    <div className="App">
      <h1>Battle Royale 2D</h1>
      <div className="buttons-container">
        <LocalButton />
        <MultiButton />
        <SettingsButton />
      </div>
    </div>
  );
}

export default App;
