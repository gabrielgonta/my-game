// src/Loading.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { code, users, currentUser } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/thegame', { state: { code, users, currentUser } });
    }, 3000); // Simuler un chargement de 3 secondes

    return () => clearTimeout(timer); // Nettoyer le timer
  }, [navigate, code, users, currentUser]);

  return (
    <div className="loading">
      <h1>Chargement...</h1>
      <p>Veuillez patienter pendant que nous préparons la partie.</p>
    </div>
  );
}

export default Loading;
