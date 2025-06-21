import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import "./App.css";
import CriarConta from "./telas/conta/CriarConta";
import FazerLogin from "./telas/conta/FazerLogin";
import SolicitarAlteracaoSenha from "./telas/conta/SolicitarAlteracaoSenha";
import AlterarSenha from "./telas/conta/AlterarSenha";
import Home from "./telas/Home";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profileId, setProfileId] = useState(null);

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token");

            if (token) {
                const user = await fetch("/api/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsAuthenticated(true);
                setProfileId(user.id);
            }
        }
        checkAuth();
    }, []);

    const logout = () => {
        // Limpar todos os dados de autenticação
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();

        // Resetar estados
        setIsAuthenticated(false);
        setProfileId(null);

        // Redirecionar para login
        window.location.href = "/login";
    };

    return (
        <Router>
            <div className="App">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="routes-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/home" replace />
                                ) : (
                                    <FazerLogin
                                        setIsAuthenticated={setIsAuthenticated}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated}>
                                    <Home
                                        profileId={profileId}
                                        logout={logout}
                                    />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/home" replace />
                                ) : (
                                    <CriarConta />
                                )
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/home" replace />
                                ) : (
                                    <FazerLogin
                                        setIsAuthenticated={setIsAuthenticated}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/recuperar-senha"
                            element={<SolicitarAlteracaoSenha />}
                        />
                        <Route
                            path="/alterar-senha"
                            element={<AlterarSenha />}
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
