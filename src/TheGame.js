// src/TheGame.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, onValue, remove, get, update } from 'firebase/database';
import { database } from './firebaseConfig';
import './TheGame.css'; // Assurez-vous d'avoir ce fichier CSS pour styliser la carte et les skins

// Importer les images des skins
import skin1 from './assets/skin1.png';
import skin2 from './assets/skin2.png';
import skin3 from './assets/skin3.png';
import skin4 from './assets/skin4.png';
import skin5 from './assets/skin5.png';

// Associer chaque skin à un numéro
const skinImages = {
  1: skin1,
  2: skin2,
  3: skin3,
  4: skin4,
  5: skin5,
};

function TheGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const { code, currentUser } = location.state || {};

  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState({});

  useEffect(() => {
    if (!code) {
      navigate('/'); // Rediriger si le code est manquant
      return;
    }

    // Assigner un skin aléatoire à un utilisateur s'il n'en a pas encore
    const assignSkin = async (username) => {
      const userRef = ref(database, `rooms/${code}/users/${username}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      if (!userData.skin) {
        // Assigner un skin aléatoire entre 1 et 5
        const randomSkin = Math.floor(Math.random() * 5) + 1;
        await update(userRef, { skin: randomSkin });
      }
    };

    // Écouter les mises à jour des utilisateurs en temps réel
    const roomRef = ref(database, `rooms/${code}/users`);
    const unsubscribe = onValue(roomRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedUsers = Object.values(data);
        setUsers(updatedUsers);

        // Assigner un skin à chaque utilisateur s'il n'en a pas encore
        for (const user of updatedUsers) {
          await assignSkin(user.username);
        }

        // Mettre à jour les positions des utilisateurs restants
        const updatedPositions = {};
        updatedUsers.forEach((user) => {
          if (user.position) {
            updatedPositions[user.username] = user.position;
          } else {
            // Si l'utilisateur n'a pas de position, en créer une aléatoire
            const newPosition = {
              x: Math.floor(Math.random() * 500),
              y: Math.floor(Math.random() * 500)
            };
            update(ref(database, `rooms/${code}/users/${user.username}/position`), newPosition);
            updatedPositions[user.username] = newPosition;
          }
        });
        setPositions(updatedPositions);
      }
    });

    // Écouter les mises à jour des positions en temps réel
    const positionsRef = ref(database, `rooms/${code}/users`);
    const unsubscribePositions = onValue(positionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedPositions = {};
        Object.keys(data).forEach((username) => {
          if (data[username].position) {
            updatedPositions[username] = data[username].position;
          }
        });
        setPositions(updatedPositions);
      }
    });

    return () => {
      unsubscribe();
      unsubscribePositions();
    };
  }, [code, navigate]);

  // Gérer le mouvement du joueur
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!currentUser) return;

      const userRef = ref(database, `rooms/${code}/users/${currentUser}/position`);
      const speed = 10; // Vitesse de déplacement

      switch (event.key) {
        case 'z': // Déplacer vers le haut
          update(userRef, { y: positions[currentUser]?.y - speed });
          break;
        case 's': // Déplacer vers le bas
          update(userRef, { y: positions[currentUser]?.y + speed });
          break;
        case 'q': // Déplacer vers la gauche
          update(userRef, { x: positions[currentUser]?.x - speed });
          break;
        case 'd': // Déplacer vers la droite
          update(userRef, { x: positions[currentUser]?.x + speed });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [code, currentUser, positions]);

  const handleLeaveRoom = async () => {
    if (!currentUser) return;

    const userRef = ref(database, `rooms/${code}/users/${currentUser}`);
    const roomRef = ref(database, `rooms/${code}`);

    try {
      await remove(userRef); // Supprimer l'utilisateur du salon

      // Vérifier si le salon est maintenant vide
      const usersSnapshot = await get(ref(database, `rooms/${code}/users`));
      if (!usersSnapshot.exists() || Object.keys(usersSnapshot.val()).length === 0) {
        await remove(roomRef); // Supprimer le salon s'il est vide
      }

      navigate('/'); // Rediriger vers la page d'accueil ou une autre page après avoir quitté
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <div className="thegame">
      <h1>Bienvenue {currentUser}</h1>
      {code && <h2>Salon : {code}</h2>}

      <div className="map">
        {Object.keys(positions).map((username) => {
          // Déterminer le skin de l'utilisateur
          const userSkin = users.find(user => user.username === username)?.skin || 1; // Utiliser skin 1 par défaut

          return (
            <img
              key={username}
              src={skinImages[userSkin]} // Utiliser l'image correspondant au skin
              alt={username}
              className="player-skin"
              style={{
                left: `${positions[username].x}px`,
                top: `${positions[username].y}px`,
                position: 'absolute',
                width: '30px', // Ajustez la taille selon vos besoins
                height: '30px', // Ajustez la taille selon vos besoins
              }}
            />
          );
        })}
      </div>

      <h3>Membres du salon :</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username}
            {user.isAdmin && <span className="badge">Admin</span>}
          </li>
        ))}
      </ul>

      <button className="menu-button" onClick={handleLeaveRoom}>
        Quitter le salon
      </button>
    </div>
  );
}

export default TheGame;
