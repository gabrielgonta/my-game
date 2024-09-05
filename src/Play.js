// src/Play.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Play() {
  const navigate = useNavigate();

  return (
    <div className="play">
      <h1>Choisissez une option</h1>
      <button className="menu-button">Créer</button>
      <button className="menu-button">Rejoindre</button>
      <button className="menu-button">Multijoueur</button>
      <button className="menu-button" onClick={() => navigate(-1)}>Retour</button>
    </div>
  );
}

export default Play;
