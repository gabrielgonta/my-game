import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Join.css';

function Join() {
    const navigate = useNavigate();

    return (
        <div className='Join'>
            <h1>Rejoindre</h1>
            <input placeholder="Code d'équipe" type='text'/>
        </div>
    )
}

export default Join;