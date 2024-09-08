// BackgroundAudio.js
import React, { useEffect, useRef } from 'react';
import sound from './assets/bande-son.wav';

function BackgroundAudio({ volume }) {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    return (
        <audio autoPlay loop ref={audioRef} src={sound} />
    );
}

export default BackgroundAudio;
