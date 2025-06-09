import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AlterarSenha() {
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        if (novaSenha !== confirmarSenha) {
            setMensagem("As senhas não coincidem.");
            return;
        }

        // Em um cenário real, você faria uma chamada de API para o backend
        // para redefinir a senha do usuário.
        console.log("Nova senha:", novaSenha);
        setMensagem("Sua senha foi alterada com sucesso!");
        navigate("/login"); // Redireciona para a página de login após a alteração
    };

    return (
        <div className="auth-container">
            <div className="auth-left-panel">
                <h1>Altere sua senha</h1>
            </div>
            <div className="auth-right-panel">
                <div className="auth-form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nova-senha">Nova senha</label>
                            <input
                                type="password"
                                id="nova-senha"
                                placeholder="Digite sua senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmar-senha">
                                Confirme a senha
                            </label>
                            <input
                                type="password"
                                id="confirmar-senha"
                                placeholder="Digite sua senha"
                                value={confirmarSenha}
                                onChange={(e) =>
                                    setConfirmarSenha(e.target.value)
                                }
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button">
                            Alterar senha
                        </button>
                        {mensagem && <p className="mensagem">{mensagem}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AlterarSenha;
