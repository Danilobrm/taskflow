import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CriarConta() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        try {
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, email, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem(data.message);
                navigate("/login"); // Redireciona para a página de login após o registro
            } else {
                setMensagem(data.message || "Erro ao registrar usuário.");
            }
        } catch (error) {
            console.error("Erro:", error);
            setMensagem("Erro ao conectar ao servidor.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left-panel">
                <h1>Criar conta</h1>
                <p>Crie sua conta e acesse suas tarefas de qualquer lugar</p>
            </div>
            <div className="auth-right-panel">
                <div className="auth-form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                placeholder="Digite seu nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
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
                            Criar conta
                        </button>
                        {mensagem && <p className="mensagem">{mensagem}</p>}
                    </form>
                    <p className="auth-links">
                        Já possui uma conta? <a href="/login">Faça Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CriarConta;
