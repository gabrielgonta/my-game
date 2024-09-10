// src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
    <form className="container">
        <label className="neon-btn">
            <span className="span"></span>
            <span className="txt">MY GAME</span>
        </label>
    </form>
      <button className="menu-button" onClick={() => navigate('/play')}>Jouer</button>
      <button className="menu-button" onClick={() => navigate('/settings')}>Settings</button>
    </div>
  );
}

export default Home;
