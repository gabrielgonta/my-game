// src/Loading.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = location.state || {};

  useEffect(() => {
    const loadResources = async () => {
      // Ici, tu pourrais charger des images, des scripts, etc.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simule un chargement de 2 secondes

      // Rediriger vers la page de jeu une fois le chargement terminé
      navigate('/thegame', { state: { code } });
    };

    loadResources();
  }, [navigate, code]);

  return (
    <div className="loading">
      <h1>Chargement...</h1>
      <p>Veuillez patienter pendant que nous préparons la partie.</p>
    </div>
  );
}

export default Loading;
