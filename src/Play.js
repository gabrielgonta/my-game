// src/Play.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupPopup from './SignupPopup';
import './App.css';

function Play() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="play">
      <h1>Choisissez une option</h1>
      <button className="menu-button" onClick={() => navigate('/create')}>Créer</button> {/* Redirection vers Create */}
      <button className="menu-button" onClick={() => navigate('/join')}>Rejoindre</button>
      <button className="menu-button" onClick={openPopup}>Multijoueur</button>
      <button className="menu-button" onClick={() => navigate(-1)}>Retour</button>
      
      {/* Affichage du popup */}
      {isPopupOpen && <SignupPopup onClose={closePopup} />}
    </div>
  );
}

export default Play;

