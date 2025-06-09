import React from "react";
import "../App.css"; // Reutiliza o CSS global para o cabeçalho

function Home() {
    return (
        <div className="content-wrapper">
            <div className="left-panel">
                <h1>Bem-vindo à sua Agenda!</h1>
                <p>Aqui você poderá gerenciar suas tarefas.</p>
            </div>
            <div className="right-panel">
                {/* Conteúdo da agenda virá aqui */}
                <p>Sua agenda está vazia no momento. Adicione novas tarefas!</p>
            </div>
        </div>
    );
}

export default Home;
