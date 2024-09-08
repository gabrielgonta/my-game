// src/TheGame.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, onValue, remove, get, update } from 'firebase/database';
import { database } from './firebaseConfig';
import './TheGame.css'; // Assurez-vous d'avoir ce fichier CSS pour styliser la carte, les skins et les barres de vie

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
  const [healths, setHealths] = useState({}); // Stocker les points de vie
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 }); // Position de la carte

  // Limites de la carte
  const MAP_WIDTH = 2000; // Largeur de la carte en pixels
  const MAP_HEIGHT = 2000; // Hauteur de la carte en pixels
  const VIEWPORT_WIDTH = 750; // Largeur de la vue
  const VIEWPORT_HEIGHT = 750; // Hauteur de la vue
  const MARGIN = 100; // Marge avant de déplacer la carte
  const SKIN_SIZE = 70; // Taille du skin en pixels

  useEffect(() => {
    if (!code) {
      navigate('/'); // Rediriger si le code est manquant
      return;
    }

    // Assigner un skin aléatoire et une barre de vie à un utilisateur s'il n'en a pas encore
    const assignSkinAndHealth = async (username) => {
      const userRef = ref(database, `rooms/${code}/users/${username}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData.skin) {
        const randomSkin = Math.floor(Math.random() * 5) + 1;
        await update(userRef, { skin: randomSkin, health: 100 }); // Ajouter une santé initiale de 100
      }
    };

    // Écouter les mises à jour des utilisateurs en temps réel
    const roomRef = ref(database, `rooms/${code}/users`);
    const unsubscribe = onValue(roomRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedUsers = Object.values(data);
        setUsers(updatedUsers);

        // Assigner un skin et une santé à chaque utilisateur s'il n'en a pas encore
        for (const user of updatedUsers) {
          await assignSkinAndHealth(user.username);
        }

        // Mettre à jour les positions et la santé des utilisateurs restants
        const updatedPositions = {};
        const updatedHealths = {};
        updatedUsers.forEach((user) => {
          if (user.position) {
            updatedPositions[user.username] = user.position;
          } else {
            // Si l'utilisateur n'a pas de position, en créer une aléatoire
            const newPosition = {
              x: Math.floor(Math.random() * MAP_WIDTH),
              y: Math.floor(Math.random() * MAP_HEIGHT)
            };
            update(ref(database, `rooms/${code}/users/${user.username}/position`), newPosition);
            updatedPositions[user.username] = newPosition;
          }
          updatedHealths[user.username] = user.health || 100; // Assigner une santé par défaut de 100
        });
        setPositions(updatedPositions);
        setHealths(updatedHealths);
      }
    });

    // Écouter les mises à jour des positions et de la santé en temps réel
    const positionsRef = ref(database, `rooms/${code}/users`);
    const unsubscribePositions = onValue(positionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedPositions = {};
        const updatedHealths = {};
        Object.keys(data).forEach((username) => {
          if (data[username].position) {
            updatedPositions[username] = data[username].position;
          }
          if (data[username].health !== undefined) {
            updatedHealths[username] = data[username].health;
          }
        });
        setPositions(updatedPositions);
        setHealths(updatedHealths);
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

      let newX = positions[currentUser]?.x;
      let newY = positions[currentUser]?.y;

      switch (event.key) {
        case 'z': // Déplacer vers le haut
          newY = (newY - speed >= 0) ? newY - speed : 0;
          break;
        case 's': // Déplacer vers le bas
          newY = (newY + speed <= MAP_HEIGHT - SKIN_SIZE) ? newY + speed : MAP_HEIGHT - SKIN_SIZE;
          break;
        case 'q': // Déplacer vers la gauche
          newX = (newX - speed >= 0) ? newX - speed : 0;
          break;
        case 'd': // Déplacer vers la droite
          newX = (newX + speed <= MAP_WIDTH - SKIN_SIZE) ? newX + speed : MAP_WIDTH - SKIN_SIZE;
          break;
        default:
          break;
      }

      update(userRef, { x: newX, y: newY });

      // Mettre à jour la position de la carte pour suivre le joueur
      let newMapX = mapPosition.x;
      let newMapY = mapPosition.y;

      if (newX < mapPosition.x + MARGIN) {
        newMapX = Math.max(newX - MARGIN, 0);
      } else if (newX > mapPosition.x + VIEWPORT_WIDTH - MARGIN - SKIN_SIZE) {
        newMapX = Math.min(newX - VIEWPORT_WIDTH + MARGIN + SKIN_SIZE, MAP_WIDTH - VIEWPORT_WIDTH);
      }

      if (newY < mapPosition.y + MARGIN) {
        newMapY = Math.max(newY - MARGIN, 0);
      } else if (newY > mapPosition.y + VIEWPORT_HEIGHT - MARGIN - SKIN_SIZE) {
        newMapY = Math.min(newY - VIEWPORT_HEIGHT + MARGIN + SKIN_SIZE, MAP_HEIGHT - VIEWPORT_HEIGHT);
      }

      setMapPosition({ x: newMapX, y: newMapY });
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [code, currentUser, positions, mapPosition]);

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
    <div className="thegame" style={{ position: 'relative', overflow: 'hidden' }}>
      <h1>Bienvenue {currentUser}</h1>
      {code && <h2>Salon : {code}</h2>}

      <div className="map" style={{ 
        position: 'relative', 
        width: `${VIEWPORT_WIDTH}px`, 
        height: `${VIEWPORT_HEIGHT}px`, 
        backgroundImage: `url(${require('./assets/map.png')})`,
        backgroundSize: `${MAP_WIDTH}px ${MAP_HEIGHT}px`,
        backgroundPosition: `-${mapPosition.x}px -${mapPosition.y}px`
      }}>
        {Object.keys(positions).map((username) => {
          const userSkin = users.find(user => user.username === username)?.skin || 1; // Utiliser skin 1 par défaut
          const userHealth = healths[username] || 100;

          return (
            <div key={username} className="player-container" style={{ 
              position: 'absolute', 
              left: `${positions[username].x - mapPosition.x}px`, 
              top: `${positions[username].y - mapPosition.y}px` 
            }}>
              <div className="health-bar" style={{ width: '50px', height: '5px', backgroundColor: '#ccc' }}>
                <div className="health" style={{ width: `${userHealth}%`, height: '100%', backgroundColor: 'green' }}></div>
              </div>
              <img
                src={skinImages[userSkin]} // Utiliser l'image correspondant au skin
                alt={username}
                className="player-skin"
                style={{
                  width: `60px`, 
                  height: `60px`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Grande barre de vie en haut à droite pour l'utilisateur actuel */}
      {currentUser && (
        <div className="large-health-bar-container">
          <h3>Vie : {healths[currentUser]} / 100</h3>
          <div className="large-health-bar" style={{ width: '200px', height: '20px', backgroundColor: '#ccc' }}>
            <div className="health" style={{ width: `${healths[currentUser]}%`, height: '100%', backgroundColor: 'green' }}></div>
          </div>
        </div>
      )}

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
