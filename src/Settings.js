// Settings.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Settings.css';
import { VolumeContext } from './App'; // Importez le contexte

function Settings() {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState('général');
    const { volume, setVolume } = useContext(VolumeContext); // Récupérez le volume et setVolume du contexte

    const handlePageChange = (e) => {
        setSelectedPage(e.target.value);
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value); // Mettez à jour le volume via le contexte
    };

    const renderContent = () => {
        switch (selectedPage) {
            case 'général':
                return <p>Paramètres généraux.</p>;
            case 'contrôles':
                return <p>Paramètres des contrôles.</p>;
            case 'vidéo':
                return <p>Paramètres vidéo.</p>;
            case 'audio':
                return (
                    <div className='audio'>
                      <h2>Paramètres audio</h2>
                      <label className="slider" htmlFor="volume">
                          <span className="volume-percentage">{volume}%</span>
                          <input id="volume" type="range" className="level" min="0" max="100" value={volume} onChange={handleVolumeChange} />
                          <svg class="volume" width="512" height="512" x="0" y="0" viewBox="0 0 24 24">
                            <g>
                              <path d="M18.36 19.36a1 1 0 0 1-.705-1.71C19.167 16.148 20 14.142 20 12s-.833-4.148-2.345-5.65a1 1 0 1 1 1.41-1.419C20.958 6.812 22 9.322 22 12s-1.042 5.188-2.935 7.069a.997.997 0 0 1-.705.291z" fill="currentColor"></path>
                              <path d="M15.53 16.53a.999.999 0 0 1-.703-1.711C15.572 14.082 16 13.054 16 12s-.428-2.082-1.173-2.819a1 1 0 1 1 1.406-1.422A6 6 0 0 1 18 12a6 6 0 0 1-1.767 4.241.996.996 0 0 1-.703.289zM12 22a1 1 0 0 1-.707-.293L6.586 17H4c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2h2.586l4.707-4.707A.998.998 0 0 1 13 3v18a1 1 0 0 1-1 1z" fill="currentColor"></path>
                            </g>
                          </svg>
                          Volume:
                      </label>
                    </div>
                );
            default:
                return null;
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
                    <input
                        id="p.général"
                        name="page"
                        type="radio"
                        value="général"
                        checked={selectedPage === 'général'}
                        onChange={handlePageChange}
                    />
                    Général
                </label>
                <label title="p.contrôles" htmlFor="p.contrôles">
                    <input
                        id="p.contrôles"
                        name="page"
                        type="radio"
                        value="contrôles"
                        checked={selectedPage === 'contrôles'}
                        onChange={handlePageChange}
                    />
                    Contrôles
                </label>
                <label title="p.vidéo" htmlFor="p.vidéo">
                    <input
                        id="p.vidéo"
                        name="page"
                        type="radio"
                        value="vidéo"
                        checked={selectedPage === 'vidéo'}
                        onChange={handlePageChange}
                    />
                    Vidéo
                </label>
                <label title="p.audio" htmlFor="p.audio">
                    <input
                        id="p.audio"
                        name="page"
                        type="radio"
                        value="audio"
                        checked={selectedPage === 'audio'}
                        onChange={handlePageChange}
                    />
                    Audio
                </label>
            </params>
            <div className="values">
                <b>{renderContent()}</b>
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
