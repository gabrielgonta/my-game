// src/TheGame.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from './firebaseConfig';

function TheGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const { code, users: initialUsers, currentUser } = location.state || {};

  const [users, setUsers] = useState(initialUsers || []); // Initialiser avec une valeur par défaut

  useEffect(() => {
    if (!code) {
      navigate('/'); // Rediriger si le code est manquant
      return;
    }

    // Écouter les mises à jour des utilisateurs en temps réel
    const roomRef = ref(database, `rooms/${code}/users`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(Object.values(data));
      }
    });

    return () => unsubscribe(); // Se désabonner du listener lorsqu'on quitte la page
  }, [code, navigate]);

  return (
    <div className="thegame">
      <h1>Bienvenue {currentUser}</h1> {/* Afficher le nom d'utilisateur */}
      {code && <h2>Salon : {code}</h2>}
      <h3>Membres du salon :</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username}
            {user.isAdmin && <span className="badge">Admin</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TheGame;
