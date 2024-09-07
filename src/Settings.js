import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Settings.css';

function Settings() {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState('général');
    const [volume, setVolume] = useState(100);
    const audioRef = useRef(null);

    const handlePageChange = (e) => {
        setSelectedPage(e.target.value);
    };

    const handleVolumeChange = (e) => {
      setVolume(e.target.value);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // Convertir le pourcentage en une valeur entre 0 et 1
    }
  }, [volume]);

    const renderContent = () => {
      switch (selectedPage) {
          case 'général':
              return <p>Paramètres généraux : ici vous pouvez modifier les paramètres de base de votre application.</p>;
          case 'contrôles':
              return <p>Paramètres des contrôles : ajustez les contrôles selon vos préférences.</p>;
          case 'vidéo':
              return <p>Paramètres vidéo : ajustez la qualité vidéo et les résolutions.</p>;
          case 'audio':
              return <div>
                        <label htmlFor="volume">Volume :</label>
                        <input id="volume" type="range" min="0" max="100" value={volume} onChange={handleVolumeChange}/>
                        <span>{volume}%</span>
                      </div>;
      }
  };

    return (
      <div className="settings">
        <form className="container">
            <label className="neon-btn">
                <span className="span"></span>
                <span className="txt">PARAMÈTRES</span>
            </label>
        </form>
        <params>
          <label title="p.général" htmlFor="p.général">
              <input id="p.général" name="page" type="radio" value="général" checked={selectedPage === 'général'} onChange={handlePageChange}/>
              Général
          </label>
          <label title="p.contrôles" htmlFor="p.contrôles">
              <input id="p.contrôles" name="page" type="radio" value="contrôles" checked={selectedPage === 'contrôles'} onChange={handlePageChange}/>
              Contrôles
          </label>
          <label title="p.vidéo" htmlFor="p.vidéo">
              <input id="p.vidéo" name="page" type="radio" value="vidéo" checked={selectedPage === 'vidéo'} onChange={handlePageChange}/>
              Vidéo
          </label>
          <label title="p.audio" htmlFor="p.audio">
              <input id="p.audio" name="page" type="radio" value="audio" checked={selectedPage === 'audio'} onChange={handlePageChange}/>
              Audio
          </label>
        </params>
        <div className='values'>
          <b>
            {renderContent()}
          </b>
        </div>
        <form className="container">
            <label className="neon-btn">
                <span className="span"></span>
                <span className="txt">ACCUEIL</span>
                <button className="p.retour" onClick={() => navigate('/')}></button>
            </label>
        </form>
      </div>
    );
}

export default Settings;