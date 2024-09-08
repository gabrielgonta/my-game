// src/App.js
import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Play from './Play';
import Settings from './Settings';
import Join from './Join';
import Create from './Create';
import Multi from './Multi';
import Loading from './Loading';
import Salon from './Salon';
import TheGame from './TheGame';
import SignupPopup from './SignupPopup';
import BackgroundAudio from './BackgroundAudio';

export const VolumeContext = createContext();

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [volume, setVolume] = useState(15);

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      <Router>
        <div className="App">
          <BackgroundAudio volume={volume} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/join" element={<Join />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create" element={<Create />} />
            <Route path="/multi" element={<Multi />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/salon/:code" element={<Salon />} />
            <Route path="/thegame" element={<TheGame />} />
          </Routes>
          {/* Afficher la popup si showPopup est true */}
          {showPopup && <SignupPopup onClose={() => setShowPopup(false)} />}
        </div>
      </Router>
    </VolumeContext.Provider>
  );
}

export default App;
