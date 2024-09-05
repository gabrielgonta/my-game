import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Settings.css';

function Settings() {
    const navigate = useNavigate();
  
    return (
      <div className="settings">
        <form class="container">
            <label class="neon-btn">
                <span class="span"></span>
                <span class="txt">PARAMÈTRES</span>
            </label>
        </form>
        <params>
            <label title="p.général" for="p.général">
            <input id="p.général" name="page" type="radio" checked/>
            Général
            </label>
            <label title="p.contrôles" for="p.contrôles">
            <input id="p.contrôles" name="page" type="radio" />
            Contrôles
            </label>
            <label title="p.vidéo" for="p.vidéo">
            <input id="p.vidéo" name="page" type="radio" />
            Vidéo
            </label>
            <label title="p.audio" for="p.audio">
            <input id="p.audio" name="page" type="radio" />
            Audio
            </label>
        </params>
        <form class="container">
            <label class="neon-btn">
                <span class="span"></span>
                <span class="txt">ACCUEIL</span>
                <button classname="p.retour" onClick={() => navigate('/')}/>
            </label>
        </form>
        {/* <button className="menu-button" onClick={() => navigate(-1)}>Retour</button> */}
      </div>
    );
  }

export default Settings;