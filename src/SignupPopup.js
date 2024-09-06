// src/SignupPopup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from './firebaseConfig';
import './Popup.css';

function SignupPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(true);  // Gérer la bascule entre Inscription et Connexion

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSignup) {
      // Inscription
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Enregistrer les données supplémentaires dans la Realtime Database
        await set(ref(database, 'users/' + userId), {
          email,
          username,
        });

        alert('Inscription réussie');
        onClose();  // Fermer le popup après l'inscription
      } catch (error) {
        alert('Erreur lors de l\'inscription: ' + error.message);
      }
    } else {
      // Connexion
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert('Connexion réussie');
        onClose();  // Fermer le popup après la connexion
        window.location.href = '/multi';  // Rediriger vers la page "Multi.js"
      } catch (error) {
        alert('Erreur lors de la connexion: ' + error.message);
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{isSignup ? 'Créer un compte' : 'Connexion'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {isSignup && (  // Afficher le champ Nom d'utilisateur uniquement en mode inscription
            <label>
              Nom d'utilisateur:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          )}
          <label>
            Mot de passe:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">{isSignup ? "S'inscrire" : 'Se connecter'}</button>
        </form>
        <p>
          {isSignup ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default SignupPopup;
