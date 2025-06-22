import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FazerLogin({ setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        try {
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password: senha }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                setIsAuthenticated(true);
                setMensagem(data.message);
                navigate("/home"); // Redireciona para a página inicial após o login
            } else {
                setMensagem(data.message || "Erro ao fazer login.");
            }
        } catch (error) {
            console.error("Erro:", error);
            setMensagem("Erro ao conectar ao servidor.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left-panel">
                <h1>Acessar minha conta</h1>
            </div>
            <div className="auth-right-panel">
                <div className="auth-form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                id="senha"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button">
                            Entrar
                        </button>
                        {mensagem && <p className="mensagem">{mensagem}</p>}
                    </form>
                    <div className="auth-links">
                        <a href="/register">Crie sua conta</a>
                        {/* <a href="/recuperar-senha">Recuperar senha</a> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FazerLogin;
