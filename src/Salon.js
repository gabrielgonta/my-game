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
        navigate('/loading', { state: { code, users, currentUser } }); // Transmettre les données du salon à Loading.js
      }
    });
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, currentUser, navigate]);  

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

  const handleStartGame = () => {
    if (!isAdmin) return;
  
    // Mettre à jour l'état du salon pour indiquer que le jeu a commencé
    const roomRef = ref(database, `rooms/${code}`);
    update(roomRef, { gameStarted: true })
      .then(() => {
        // Transmettre currentUser en plus du code et des utilisateurs
        navigate('/loading', { state: { code, users, currentUser } });
      })
      .catch((error) => {
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
