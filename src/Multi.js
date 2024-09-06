// src/Multi.js
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Multi() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);  // État pour savoir si on attend les données
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si un utilisateur est connecté
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Utilisateur connecté
        const userId = user.uid;

        try {
          // Récupérer le nom d'utilisateur depuis la base de données
          const userRef = ref(database, 'users/' + userId);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUsername(userData.username);  // Mettre à jour le nom d'utilisateur
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }

        setLoading(false);  // Les données sont chargées
      } else {
        // Aucun utilisateur connecté, rediriger vers la page d'accueil
        navigate('/');
      }
    });

    // Nettoyer l'écouteur de l'état de l'authentification
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/');  // Rediriger vers la page d'accueil après déconnexion
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion:', error);
      });
  };

  if (loading) {
    return <div>Chargement...</div>;  // Afficher un message de chargement pendant la récupération des données
  }

  return (
    <div>
      <h1>Bienvenue dans le mode Multijoueur</h1>
      <p>Vous êtes connecté en tant que : {username}</p>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}

export default Multi;
