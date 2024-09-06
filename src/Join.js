// src/Join.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, update } from 'firebase/database';
import { database } from './firebaseConfig';

function Join() {
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);

    if (newCode.length === 6) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleJoinRoom = async () => {
    if (username.trim() === '') {
      alert('Veuillez entrer un nom d’utilisateur');
      return;
    }

    const roomRef = ref(database, `rooms/${code}`);
    const snapshot = await get(roomRef);

    if (snapshot.exists()) {
      // Ajouter l'utilisateur dans le salon
      await update(roomRef, {
        [`users/${username}`]: {
          username,
          isAdmin: false,  // L'utilisateur rejoignant n'est pas l'admin
        },
      });

      // Rediriger vers le salon avec le code et le nom d'utilisateur
      navigate(`/salon/${code}`, { state: { username } });
    } else {
      alert('Code de salon incorrect');
    }
  };

  return (
    <div className="Join">
      <h1>Rejoindre</h1>
      <input value={code} onChange={handleChange} placeholder="Code du salon" type="text" maxLength={6} />
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nom d'utilisateur" type="text" />

      {showButton && (
        <button className="submitButton" onClick={handleJoinRoom}>
          Valider
        </button>
      )}
      <button className="menu-button" onClick={() => navigate(-1)}>Retour</button>
    </div>
  );
}

export default Join;
