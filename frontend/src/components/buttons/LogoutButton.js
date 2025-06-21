import React from "react";
import "./LogoutButton.css"; // Optional styling

export const LogoutButton = ({ onClick }) => {
    return (
        <button
            className="logout-button"
            onClick={onClick}
            title="Sair do sistema"
        >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Sair</span>
        </button>
    );
};
