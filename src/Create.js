// src/Create.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { database } from './firebaseConfig';
import './Create.css';

function generateRoomCode() {
  // Générer un code aléatoire de 6 caractères
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

function Create() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (username.trim() === '') {
      alert('Veuillez entrer un nom d’utilisateur');
      return;
    }

    const roomCode = generateRoomCode();

    // Créer un salon dans Firebase avec le code généré
    const roomRef = ref(database, `rooms/${roomCode}`);
    set(roomRef, {
      owner: username,
      users: {
        [username]: {
          username,
          isAdmin: true,  // Indiquer que cet utilisateur est l'admin
        },
      },
    });

    // Rediriger vers la page du salon avec le code généré et le nom d'utilisateur
    navigate(`/salon/${roomCode}`, { state: { username } });
  };

  return (
    <div className="create">
    <form className="container">
        <label className="neon-btn">
            <span className="span"></span>
            <span className="txt">CRÉER UN SALON</span>
        </label>
    </form>
      <input value={username} className='name' onChange={(e) => setUsername(e.target.value)} placeholder="PSEUDO" type="text"/>
      <button className="menu-button" onClick={handleCreateRoom}>
        Continuer
      </button>
      <button className="menu-button" onClick={() => navigate(-1)}>
        Retour
      </button>
    </div>
  );
}

export default Create;
