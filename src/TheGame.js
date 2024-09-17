import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, onValue, remove, get, update } from 'firebase/database';
import { database } from './firebaseConfig';
import './TheGame.css'; // Assurez-vous d'avoir ce fichier CSS pour styliser la carte, les skins et les barres de vie
import { ProjectileContext } from './App'; // Importez ProjectileContext

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
  const keyProjectile = useContext(ProjectileContext);

  const location = useLocation();
  const navigate = useNavigate();
  const { code, currentUser } = location.state || {};

  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState({});
  const [healths, setHealths] = useState({});
  const [projectiles, setProjectiles] = useState([]); // Nouvel état pour les projectiles
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Position de la souris

  const MAP_WIDTH = 2000;
  const MAP_HEIGHT = 2000;
  const VIEWPORT_WIDTH = 750;
  const VIEWPORT_HEIGHT = 750;
  const MARGIN = 100;
  const SKIN_SIZE = 70;
  const PROJECTILE_SPEED = 5; // Vitesse du projectile
  const PROJECTILE_MAX_DISTANCE = 400; // Distance maximale avant disparition0


  useEffect(() => {
    console.log(`Projectile key: ${keyProjectile}`); // Ajoutez ce log
    const handleKeyPress = (event) => {
      console.log(`Key pressed: ${event.key}`); // Log pour vérifier la touche pressée
      if (!currentUser) return;
  
      if (event.key === keyProjectile) {
        // Log pour voir si la touche personnalisée est bien reconnue
        console.log('Projectile key detected, firing projectile...');
      }
  
      // Le reste du code ici...
    };
  
    window.addEventListener('keydown', handleKeyPress);
  
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [positions, mapPosition, mousePosition, currentUser, code, keyProjectile]);
  






  useEffect(() => {
    if (!code) {
      navigate('/');
      return;
    }

    const assignSkinAndHealth = async (username) => {
      const userRef = ref(database, `rooms/${code}/users/${username}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData.skin) {
        const randomSkin = Math.floor(Math.random() * 5) + 1;
        await update(userRef, { skin: randomSkin, health: 100 });
      }
    };

    const roomRef = ref(database, `rooms/${code}/users`);
    const unsubscribe = onValue(roomRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedUsers = Object.values(data);
        setUsers(updatedUsers);

        for (const user of updatedUsers) {
          await assignSkinAndHealth(user.username);
        }

        const updatedPositions = {};
        const updatedHealths = {};
        updatedUsers.forEach((user) => {
          if (user.position) {
            updatedPositions[user.username] = user.position;
          } else {
            const newPosition = {
              x: Math.floor(Math.random() * MAP_WIDTH),
              y: Math.floor(Math.random() * MAP_HEIGHT)
            };
            update(ref(database, `rooms/${code}/users/${user.username}/position`), newPosition);
            updatedPositions[user.username] = newPosition;
          }
          updatedHealths[user.username] = user.health || 100;
        });
        setPositions(updatedPositions);
        setHealths(updatedHealths);
      }
    });

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

  // Capturer la position de la souris
  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = event.target.getBoundingClientRect();
      const mouseX = event.clientX - rect.left + mapPosition.x;
      const mouseY = event.clientY - rect.top + mapPosition.y;
      setMousePosition({ x: mouseX, y: mouseY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mapPosition]);

  // Gérer le mouvement du joueur et le tir des projectiles
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!currentUser) return;

      const userRef = ref(database, `rooms/${code}/users/${currentUser}/position`);
      const speed = 60;

      let newX = positions[currentUser]?.x;
      let newY = positions[currentUser]?.y;

      switch (event.key) {
        case 'z':
          newY = (newY - speed >= 0) ? newY - speed : 0;
          break;
        case 's':
          newY = (newY + speed <= MAP_HEIGHT - SKIN_SIZE) ? newY + speed : MAP_HEIGHT - SKIN_SIZE;
          break;
        case 'q':
          newX = (newX - speed >= 0) ? newX - speed : 0;
          break;
        case 'd':
          newX = (newX + speed <= MAP_WIDTH - SKIN_SIZE) ? newX + speed : MAP_WIDTH - SKIN_SIZE;
          break;
        case keyProjectile: // Tirer un projectile vers la souris
          const playerPos = positions[currentUser];
          const dx = mousePosition.x - playerPos.x;
          const dy = mousePosition.y - playerPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const velocityX = (dx / distance) * PROJECTILE_SPEED;
          const velocityY = (dy / distance) * PROJECTILE_SPEED;

          const newProjectile = {
            x: playerPos.x + SKIN_SIZE / 2, // Centrer le projectile sur le joueur
            y: playerPos.y + SKIN_SIZE / 2,
            velocityX: velocityX,
            velocityY: velocityY,
            distance: 0 // Initialiser la distance parcourue à 0
          };
          setProjectiles((prevProjectiles) => [...prevProjectiles, newProjectile]);
          break;
        default:
          break;
      }

      update(userRef, { x: newX, y: newY });

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
  }, [code, currentUser, positions, mapPosition, mousePosition]);

  // Déplacer les projectiles
  useEffect(() => {
    const intervalId = setInterval(() => {
      setProjectiles((prevProjectiles) =>
        prevProjectiles
          .map((proj) => ({
            ...proj,
            x: proj.x + proj.velocityX,
            y: proj.y + proj.velocityY,
            distance: proj.distance + PROJECTILE_SPEED
          }))
          .filter((proj) => proj.distance < PROJECTILE_MAX_DISTANCE)
      );
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(intervalId);
  }, []);

  const handleLeaveRoom = async () => {
    try {
      const userRef = ref(database, `rooms/${code}/users/${currentUser}`);
      await remove(userRef);

      const roomRef = ref(database, `rooms/${code}`);
      const usersSnapshotAfterRemove = await get(ref(database, `rooms/${code}/users`));
      if (!usersSnapshotAfterRemove.exists()) {
        await remove(roomRef);
      }

      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la sortie du salon :", error);
    }
  };

  return (
    <div className="game-container" style={{ position: 'relative', overflow: 'hidden' }}>
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
          const userSkin = users.find(user => user.username === username)?.skin || 1;
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
                src={skinImages[userSkin]}
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

        {/* Affichage des projectiles */}
        {projectiles.map((proj, index) => (
          <div key={index} className="projectile" style={{ 
            position: 'absolute', 
            width: '10px', 
            height: '10px', 
            backgroundColor: 'red', 
            left: `${proj.x - mapPosition.x}px`, 
            top: `${proj.y - mapPosition.y}px`
          }}></div>
        ))}
      </div>

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
