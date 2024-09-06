// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Play from './Play';
import Settings from './Settings';
import Join from './Join';
import Create from './Create';
import Multi from './Multi';
import Salon from './Salon';
import Loading from './Loading';
import TheGame from './TheGame';
import SignupPopup from './SignupPopup';  // Importer le composant de la popup

function App() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/join" element={<Join />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create" element={<Create />} />
          <Route path="/multi" element={<Multi />} />
          <Route path="/salon/:code" element={<Salon />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/thegame" element={<TheGame />} />
        </Routes>
        {/* Afficher la popup si showPopup est true */}
        {showPopup && <SignupPopup onClose={() => setShowPopup(false)} />}
      </div>
    </Router>
  );
}

export default App;
