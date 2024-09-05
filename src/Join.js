import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Join.css';

function verifcode(code) {
    // si le code entré est dans la base de données contenant les différents codes d'équipe,
    // l'utilisateur rejoint le salon, sinon afficher un message d'érreur.
}

function Join() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [showButton, setShowButton] = useState(false);
  
    const handleChange = (event) => {
      const newCode = event.target.value;
      setCode(newCode);
  
      if (newCode.length == 6) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    return (
        <div className='Join'>
            <h1>Rejoindre</h1>
            <input  value={code} onChange={handleChange} placeholder="Code d'équipe" type='text' maxLength={6}/>
            {showButton && <button className="submitButton" onClick={() => verifcode(code)}>
                                <span class="ligne"> VALIDER </span>
                                <svg width="30" height="10" viewBox="0 0 46 16">
                                <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)" fill='white'></path>
                                </svg>
                            </button>
                            }
            <button className="menu-button" onClick={() => navigate(-1)}>Retour</button>
        </div>
    )
}

export default Join;