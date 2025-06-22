import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CriarConta() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = [];

    if (!nome) {
      errors.push("Nome é obrigatório.");
    }

    if (!email) {
      errors.push("Email é obrigatório.");
    }

    if (!senha) {
      errors.push("Senha é obrigatória.");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nome, email, password: senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao registrar usuário.");
        return;
      }
      console.log(data);
      toast.success(data.message || "Usuário registrado com sucesso!");
      navigate("/login"); // Redireciona para a página de login após o registro
    } catch (error) {
      console.error("Erro:", error);
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
              />
            </div>
            <button type="submit" className="auth-button">
              Criar conta
            </button>
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
