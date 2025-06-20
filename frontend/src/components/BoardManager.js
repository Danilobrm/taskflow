import React, { useState } from "react";
import "./BoardManager.css";

export default function BoardManager({ board, onUpdate, onDelete, onClose }) {
    const [editMode, setEditMode] = useState(false);
    const [boardData, setBoardData] = useState({
        name: board.name,
        description: board.description || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBoardData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!boardData.name.trim()) {
            setError("Nome do quadro é obrigatório");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/boards/${board.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(boardData),
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao atualizar quadro");
            }

            const updatedBoard = await response.json();
            onUpdate(updatedBoard);
            setEditMode(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (
            !window.confirm(
                `Tem certeza que deseja excluir o quadro "${board.name}"? Esta ação não pode ser desfeita.`
            )
        ) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/boards/${board.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao deletar quadro");
            }

            onDelete(board.id);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="board-manager">
            <div className="board-manager-header">
                <h3>Gerenciar Quadro</h3>
                <button type="button" className="close-btn" onClick={onClose}>
                    ×
                </button>
            </div>

            {!editMode ? (
                <div className="board-info">
                    <div className="info-row">
                        <label>Nome:</label>
                        <span>{board.name}</span>
                    </div>
                    <div className="info-row">
                        <label>Descrição:</label>
                        <span>{board.description || "Sem descrição"}</span>
                    </div>
                    <div className="info-row">
                        <label>Criado em:</label>
                        <span>
                            {new Date(board.created_at).toLocaleDateString(
                                "pt-BR"
                            )}
                        </span>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleUpdate} className="board-form">
                    <div className="form-group">
                        <label>Nome do Quadro*</label>
                        <input
                            type="text"
                            name="name"
                            value={boardData.name}
                            onChange={handleInputChange}
                            placeholder="Nome do quadro"
                            required
                            disabled={loading}
                            maxLength={255}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            name="description"
                            value={boardData.description}
                            onChange={handleInputChange}
                            placeholder="Descrição do quadro (opcional)"
                            rows="3"
                            disabled={loading}
                            maxLength={500}
                        />
                    </div>
                </form>
            )}

            {error && <p className="error-message">{error}</p>}

            <div className="board-manager-actions">
                {!editMode ? (
                    <>
                        <button
                            type="button"
                            className="edit-btn"
                            onClick={() => setEditMode(true)}
                            disabled={loading}
                        >
                            Editar
                        </button>
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? "Excluindo..." : "Excluir"}
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => {
                                setEditMode(false);
                                setBoardData({
                                    name: board.name,
                                    description: board.description || "",
                                });
                                setError(null);
                            }}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            onClick={handleUpdate}
                            disabled={loading || !boardData.name.trim()}
                        >
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
