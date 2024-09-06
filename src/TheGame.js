// src/TheGame.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from './firebaseConfig';
import './TheGame.css';

function TheGame() {
  const location = useLocation();
  const { code } = location.state || {};
  const [players, setPlayers] = useState([]);
  const [skins, setSkins] = useState({});

  useEffect(() => {
    if (!code) return;

    const roomRef = ref(database, `rooms/${code}`);

    // Écouter les informations du salon
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.usedSkins) {
        setSkins(data.usedSkins);

        // Récupérer les informations des joueurs
        const users = Object.keys(data.usedSkins).map(username => ({
          username,
          skin: data.usedSkins[username]
        }));
        setPlayers(users);
      }
    });
  }, [code]);

  return (
    <div className="the-game">
      <h1>La Partie</h1>
      <div className="players">
        {players.map((player, index) => (
          <div key={index} className="player">
            <img src={`/assets/${player.skin}`} alt={`Skin de ${player.username}`} />
            <p>{player.username}</p>
          </div>
        ))}
      </div>
      {/* Ton contenu de jeu va ici */}
    </div>
  );
}

export default TheGame;
