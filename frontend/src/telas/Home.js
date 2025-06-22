import React, { useState, useEffect } from "react";
import "./Home.css";
import TaskBoard from "../components/tasks/TaskBoard";
import Categories from "../components/Categories";
import ProfileManager from "../components/ProfileManager";
import { LogoutButton } from "../components/buttons/LogoutButton";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

function Home({ profileId, logout }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("home");
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();

    // Carrega os quadros do usuário
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "http://localhost:3001/api/boards",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch boards");

                const data = await response.json();
                setBoards(data);

                // Seleciona o primeiro quadro por padrão se existir
                if (data.length > 0 && !selectedBoardId) {
                    setSelectedBoardId(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching boards:", error);
                setBoards([]);
            }
        };

        fetchBoards();
    }, []); // Removido selectedBoardId da dependência para evitar loop infinito

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Cria um novo quadro
    const handleCreateBoard = async (boardName) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3001/api/boards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: boardName }),
            });

            if (!response.ok) throw new Error("Failed to create board");

            const newBoard = await response.json();

            // Atualiza a lista de quadros e seleciona o novo quadro
            setBoards([...boards, newBoard]);
            setSelectedBoardId(newBoard.id);
            setActiveTab("tasks");
        } catch (error) {
            console.error("Error creating board:", error);
            alert("Failed to create board. Please try again.");
        }
    };

    // Atualiza um quadro
    const handleUpdateBoard = (updatedBoard) => {
        setBoards(
            boards.map((board) =>
                board.id === updatedBoard.id ? updatedBoard : board
            )
        );
    };

    // Deleta um quadro
    const handleDeleteBoard = (boardId) => {
        setBoards(boards.filter((board) => board.id !== boardId));

        // Se o quadro deletado era o selecionado, seleciona outro ou vai para home
        if (selectedBoardId === boardId) {
            const remainingBoards = boards.filter(
                (board) => board.id !== boardId
            );
            if (remainingBoards.length > 0) {
                setSelectedBoardId(remainingBoards[0].id);
            } else {
                setSelectedBoardId(null);
                setActiveTab("home");
            }
        }
    };

    // Renderiza o conteúdo baseado na aba ativa
    const renderContent = () => {
        switch (activeTab) {
            case "tasks":
                return selectedBoardId ? (
                    <TaskBoard boardId={selectedBoardId} />
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>Nenhum quadro selecionado</h3>
                        <p>
                            Selecione um quadro ou crie um novo para começar a
                            gerenciar suas tarefas.
                        </p>
                        <button onClick={() => setActiveTab("home")}>
                            Criar novo quadro
                        </button>
                    </div>
                );
            case "categories":
                return <Categories />;
            case "profile":
                return <ProfileManager />;
            case "home":
                return (
                    <div className="home-content">
                        <div className="welcome-section">
                            <h2>Bem-vindo ao TaskFlow</h2>
                            <p>
                                Organize suas tarefas de forma simples e
                                eficiente. Crie quadros, adicione categorias e
                                mantenha tudo sob controle.
                            </p>
                        </div>

                        {boards.length === 0 ? (
                            <div className="empty-boards">
                                <div className="empty-boards-icon">🚀</div>
                                <h3>Vamos começar!</h3>
                                <p>
                                    Você ainda não tem nenhum quadro. Crie seu
                                    primeiro quadro para começar a organizar
                                    suas tarefas.
                                </p>
                                <div className="features-grid">
                                    <div className="feature-card">
                                        <div className="feature-icon">📋</div>
                                        <h4>Quadros Organizados</h4>
                                        <p>
                                            Crie quadros para diferentes
                                            projetos ou áreas da sua vida
                                        </p>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-icon">🏷️</div>
                                        <h4>Categorias Coloridas</h4>
                                        <p>
                                            Organize tarefas com categorias
                                            personalizadas e cores
                                        </p>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-icon">✅</div>
                                        <h4>Controle Total</h4>
                                        <p>
                                            Acompanhe o progresso e gerencie
                                            suas tarefas facilmente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="boards-overview">
                                <h3>Seus Quadros ({boards.length})</h3>
                                <div className="boards-grid">
                                    {boards.map((board) => (
                                        <div
                                            key={board.id}
                                            className="board-card"
                                            onClick={() => {
                                                setSelectedBoardId(board.id);
                                                setActiveTab("tasks");
                                            }}
                                        >
                                            <div className="board-card-icon">
                                                📋
                                            </div>
                                            <h4>{board.name}</h4>
                                            <p>
                                                {board.description ||
                                                    "Sem descrição"}
                                            </p>
                                            <div className="board-card-footer">
                                                <span>
                                                    Criado em{" "}
                                                    {new Date(
                                                        board.created_at
                                                    ).toLocaleDateString(
                                                        "pt-BR"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="App-body">
            <header className="App-header">
                <span style={{ display: "flex", alignItems: "center" }}>
                    <div className="header-circle"></div>
                    <div className="taskflow-title">TASKFLOW</div>
                </span>
                <LogoutButton onClick={handleLogout} />
            </header>

            <div className="content-wrapper">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    selectedBoardId={selectedBoardId}
                    setSelectedBoardId={setSelectedBoardId}
                    onCreateBoard={handleCreateBoard}
                    onUpdateBoard={handleUpdateBoard}
                    onDeleteBoard={handleDeleteBoard}
                    boards={boards}
                />
                <main
                    className={`main-content ${
                        sidebarOpen ? "sidebar-open" : "sidebar-closed"
                    }`}
                >
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default Home;
