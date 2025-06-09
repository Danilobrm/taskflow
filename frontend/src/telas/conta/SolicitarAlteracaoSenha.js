import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SolicitarAlteracaoSenha() {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        // Em um cenário real, você faria uma chamada de API para o backend
        // para enviar um e-mail com um link de redefinição de senha.
        console.log("Solicitação de alteração de senha para:", email);
        setMensagem(
            "Se um e-mail correspondente for encontrado, um link para redefinir sua senha será enviado."
        );
        // navigate('/login'); // Opcional: Redirecionar após a solicitação
    };

    return (
        <div className="auth-container">
            <div className="auth-left-panel">
                <h1>Recuperar minha conta</h1>
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
                        <button type="submit" className="auth-button">
                            Enviar email
                        </button>
                        {mensagem && <p className="mensagem">{mensagem}</p>}
                    </form>
                    <p className="auth-links">
                        <a href="/login">Voltar</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SolicitarAlteracaoSenha;
