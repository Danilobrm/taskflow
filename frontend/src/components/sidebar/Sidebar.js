import { useState, useEffect, useRef } from "react";
import BoardManager from "../BoardManager.js";
import "./Sidebar.css";

export default function Sidebar({
    sidebarOpen,
    toggleSidebar,
    activeTab,
    setActiveTab,
    selectedBoardId,
    setSelectedBoardId,
    onCreateBoard, // Nova prop para criar quadros
    boards, // Receber boards como prop
    onUpdateBoard, // Nova prop para atualizar quadros
    onDeleteBoard, // Nova prop para deletar quadros
}) {
    const [newBoardName, setNewBoardName] = useState("");
    const [isCreatingBoard, setIsCreatingBoard] = useState(false);
    const [showBoardManager, setShowBoardManager] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        // ✅ Select the first board only on first fetch (first render)
        if (!hasInitialized.current && boards.length > 0) {
            setSelectedBoardId(boards[0].id);
            hasInitialized.current = true;
        }
    }, [boards, setSelectedBoardId]);

    const handleCreateBoard = () => {
        if (newBoardName.trim()) {
            onCreateBoard(newBoardName);
            setNewBoardName("");
            setIsCreatingBoard(false);
        }
    };

    const handleBoardSettings = (board, e) => {
        e.stopPropagation(); // Evita que o clique propague para o item do quadro
        setSelectedBoard(board);
        setShowBoardManager(true);
    };

    const handleUpdateBoard = (updatedBoard) => {
        onUpdateBoard(updatedBoard);
        setShowBoardManager(false);
    };

    const handleDeleteBoard = (boardId) => {
        onDeleteBoard(boardId);
        setShowBoardManager(false);
    };

    if (showBoardManager && selectedBoard) {
        return (
            <div className="sidebar-overlay">
                <div className="sidebar-modal">
                    <BoardManager
                        board={selectedBoard}
                        onUpdate={handleUpdateBoard}
                        onDelete={handleDeleteBoard}
                        onClose={() => setShowBoardManager(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <aside className={`App-sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {sidebarOpen ? <span>&times;</span> : <span>&#9776;</span>}
            </button>

            <nav>
                {/* Seção Início */}
                <div className="sidebar-section">
                    <h4 className="sidebar-section-title">Início</h4>
                    <ul>
                        <li
                            className={`sidebar-item ${
                                activeTab === "home" ? "active" : ""
                            }`}
                            onClick={() => {
                                setActiveTab("home");
                                setSelectedBoardId(null);
                            }}
                        >
                            <span className="sidebar-icon">🏠</span>
                            <span className="sidebar-text">Página Inicial</span>
                        </li>
                    </ul>
                </div>

                {/* Seção Quadros */}
                <div className="sidebar-section">
                    <h4 className="sidebar-section-title">Seus Quadros</h4>
                    <ul>
                        {boards.length > 0 ? (
                            boards.map((board) => (
                                <li
                                    key={board.id}
                                    className={`sidebar-item ${
                                        board.id === selectedBoardId
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedBoardId(board.id);
                                        setActiveTab("tasks");
                                    }}
                                >
                                    <div className="board-item-content">
                                        <span className="sidebar-icon">📋</span>
                                        <span className="sidebar-text">
                                            {board.name}
                                        </span>
                                    </div>
                                    <button
                                        className="board-settings-btn"
                                        onClick={(e) =>
                                            handleBoardSettings(board, e)
                                        }
                                        title="Configurações do quadro"
                                    >
                                        ⋯
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="sidebar-item empty">
                                <span className="sidebar-text">
                                    Nenhum quadro criado
                                </span>
                            </li>
                        )}
                    </ul>
                    <ul>
                        {isCreatingBoard ? (
                            <li className="sidebar-item board-creator">
                                <input
                                    type="text"
                                    value={newBoardName}
                                    onChange={(e) =>
                                        setNewBoardName(e.target.value)
                                    }
                                    placeholder="Nome do quadro"
                                    autoFocus
                                />
                                <div className="board-creator-actions">
                                    <button onClick={handleCreateBoard}>
                                        Criar
                                    </button>
                                    <button
                                        onClick={() =>
                                            setIsCreatingBoard(false)
                                        }
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </li>
                        ) : (
                            <li
                                className="sidebar-item"
                                onClick={() => setIsCreatingBoard(true)}
                            >
                                <span className="sidebar-icon">+</span>
                                <span className="sidebar-text">
                                    Criar Quadro
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </aside>
    );
}
