// src/TheGame.js
import React from 'react';
import { useLocation } from 'react-router-dom';

function TheGame() {
  const location = useLocation();
  const { code } = location.state || {};

  return (
    <div className="the-game">
      <h1>La Partie</h1>
      <p>Bienvenue dans le jeu !</p>
      <p>Code du salon : {code}</p>
      {/* Ton contenu de jeu va ici */}
    </div>
  );
}

export default TheGame;
