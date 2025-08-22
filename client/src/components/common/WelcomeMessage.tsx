import React from 'react';
import './WelcomeMessage.css';

const WelcomeMessage: React.FC = () => {
    return (
        <div className="welcome-container">
            <h2 className="welcome-title">¡Bienvenido a PokeMix!</h2>
            <p className="welcome-text">
                Usa la lista de la izquierda para explorar los Pokémon.
            </p>
            <p className="welcome-text">
                ¡Selecciona uno para ver sus detalles!
            </p>
        </div>
    )
}

export default WelcomeMessage;