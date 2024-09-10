// src/Join.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, update } from 'firebase/database';
import { database } from './firebaseConfig';
import './Join.css';

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
    <form className="container">
        <label className="neon-btn">
            <span className="span"></span>
            <span className="txt">REJOINDRE</span>
        </label>
    </form>
      <input value={username} className='name' onChange={(e) => setUsername(e.target.value)} placeholder="PSEUDO" type="text" />
      <input value={code} className='code' onChange={handleChange} placeholder="Code du salon" type="text" maxLength={6} />

      {showButton && (
        <button className="submitButton" onClick={handleJoinRoom}>
          <span className='ligne'>VALIDER</span>
          <svg width="30" height="10" viewBox="0 0 46 16">
            <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" fill='white' transform="translate(30)"></path>
          </svg>
        </button>
      )}
      <button className="menu-button" onClick={() => navigate(-1)}>Retour</button>
    </div>
  );
}

export default Join;
