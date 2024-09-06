// src/Salon.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ref, onValue, remove, get, update } from 'firebase/database';
import { database } from './firebaseConfig';

function Salon() {
  const { code } = useParams(); // Obtenir le code du salon depuis l'URL
  const location = useLocation(); // Obtenir l'état passé par navigate
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInRoom = async () => {
      const roomRef = ref(database, `rooms/${code}/users/${location.state?.username}`);
      const snapshot = await get(roomRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setCurrentUser(location.state?.username || '');
        setIsAdmin(userData.isAdmin || false);
      } else {
        navigate('/'); // Rediriger vers la page d'accueil si l'utilisateur n'est pas autorisé
      }
    };

    checkUserInRoom();
  }, [code, location.state?.username, navigate]);

  useEffect(() => {
    if (!currentUser) return; // Ne pas continuer si l'utilisateur n'est pas autorisé

    const roomRef = ref(database, `rooms/${code}/users`);

    // Écouter les mises à jour des utilisateurs dans le salon
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(Object.values(data));
      }
    });

    const gameRef = ref(database, `rooms/${code}/gameStarted`);
    onValue(gameRef, (snapshot) => {
      if (snapshot.exists() && snapshot.val() === true) {
        navigate('/loading', { state: { code } });
      }
    });
  }, [code, currentUser, navigate]);

  const handleLeaveRoom = () => {
    if (!currentUser) return;

    const userRef = ref(database, `rooms/${code}/users/${currentUser}`);

    // Supprimer l'utilisateur du salon
    remove(userRef)
      .then(() => {
        // Rediriger vers la page d'accueil ou une autre page après avoir quitté
        navigate('/');
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion :', error);
      });
  };

  const handleStartGame = () => {
        if (!isAdmin) return;

        const roomRef = ref(database, `rooms/${code}`);

        // Liste des skins disponibles
        const skins = ['skin1.png', 'skin2.png', 'skin3.png', 'skin4.png', 'skin5.png'];

        // Préparer l'état des skins utilisés
        const usedSkins = {};

        // Pour chaque utilisateur, assigner un skin unique
        users.forEach(user => {
            let skinAssigned = false;
            while (!skinAssigned) {
                const randomIndex = Math.floor(Math.random() * skins.length);
                const chosenSkin = skins[randomIndex];
                if (!Object.values(usedSkins).includes(chosenSkin)) {
                    usedSkins[user.username] = chosenSkin;
                    skinAssigned = true;
                }
            }
        });

        // Mettre à jour l'état du salon et des utilisateurs
        update(roomRef, { 
            gameStarted: true, 
            usedSkins 
        }).then(() => {
            navigate('/loading', { state: { code } });
        }).catch((error) => {
            console.error('Erreur lors du démarrage du jeu :', error);
        });
    };


  return (
    <div className="salon">
      <h1>Salon : {code}</h1>
      <h2>Vous êtes {currentUser}</h2>
      <h3>Nombre de membres : {users.length}</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username}
            {user.isAdmin && <span className="badge">Admin</span>}
          </li>
        ))}
      </ul>
      {isAdmin && (
        <button className="menu-button" onClick={handleStartGame}>
          Lancer la partie
        </button>
      )}
      <button className="menu-button" onClick={handleLeaveRoom}>
        Quitter le salon
      </button>
    </div>
  );
}

export default Salon;
