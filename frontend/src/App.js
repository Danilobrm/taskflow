import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CriarConta from "./telas/conta/CriarConta";
import FazerLogin from "./telas/conta/FazerLogin";
import SolicitarAlteracaoSenha from "./telas/conta/SolicitarAlteracaoSenha";
import AlterarSenha from "./telas/conta/AlterarSenha";
import Home from "./telas/Home";

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <div className="header-circle"></div>
                    <div className="taskflow-title">TASKFLOW</div>
                </header>
                <div className="routes-content">
                    <Routes>
                        <Route path="/" element={<FazerLogin />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/register" element={<CriarConta />} />
                        <Route path="/login" element={<FazerLogin />} />
                        <Route
                            path="/recuperar-senha"
                            element={<SolicitarAlteracaoSenha />}
                        />
                        <Route
                            path="/alterar-senha"
                            element={<AlterarSenha />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
