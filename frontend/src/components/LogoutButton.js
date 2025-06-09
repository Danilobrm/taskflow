import React from "react";
import "./LogoutButton.css"; // Optional styling

const LogoutButton = ({ onClick }) => {
  return (
    <button className="logout-button" onClick={onClick}>
      <span className="logout-icon">⎋</span>
      <span className="logout-text">Sair</span>
    </button>
  );
};

export default LogoutButton;
