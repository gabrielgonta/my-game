// src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Battle Royale 2D</h1>
      <button className="menu-button" onClick={() => navigate('/play')}>Jouer</button>
      <button className="menu-button" onClick={() => navigate('/settings')}>Settings</button>
    </div>
  );
}

export default Home;
