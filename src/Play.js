// src/Play.js
import React, { useState } from 'react';
import './App.css';
import './PopUp.css';

function Play() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fonction pour gérer la soumission du formulaire
  const handleLogin = async (e) => {
    e.preventDefault();

    // Envoi des données vers le serveur PHP
    try {
      const response = await fetch('http://localhost/connexion.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Connexion réussie !');
        setShowPopup(false); // Fermer la popup après une connexion réussie
      } else {
        alert('Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="play">
      <h1>Choisissez une option</h1>
      <button className="menu-button">Créer</button>
      <button className="menu-button">Rejoindre</button>
      <button className="menu-button" onClick={() => setShowPopup(true)}>Multijoueur</button>
      
      <button className="menu-button" onClick={() => window.history.back()}>Retour</button>

      {/* Popup pour la connexion */}
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
              <label>Email ou Username :</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Password :</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Se connecter</button>
            </form>
            <button onClick={() => setShowPopup(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Play;
