import { useState, useEffect } from "react";
import CategoryManager from "../../CategoryManager.js";
import "./TaskEditor.css";

export default function TaskEditor({
    onSave,
    onCancel,
    boardId,
    defaultStatus = "PENDENTE",
}) {
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        status: defaultStatus,
        category_id: "",
        assigned_to: "",
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCategoryManager, setShowCategoryManager] = useState(false);

    const statuses = ["PENDENTE", "EM ANDAMENTO", "CONCLUÍDO"];

    // Carregar categorias do board
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:3001/api/boards/${boardId}/categories`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const categoriesData = await response.json();
                    setCategories(categoriesData);
                }
            } catch (err) {
                console.error("Erro ao carregar categorias:", err);
            }
        };

        if (boardId) {
            loadCategories();
        }
    }, [boardId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const payload = {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            category_id: taskData.category_id,
            board_id: boardId,
            assigned_to: taskData.assigned_to || null,
        };

        try {
            const response = await fetch(
                `http://localhost:3001/api/boards/${boardId}/tasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Erro ao salvar a tarefa");
            }

            const savedTask = await response.json();
            onSave(savedTask);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (updatedCategories) => {
        setCategories(updatedCategories);
    };

    if (showCategoryManager) {
        return (
            <div className="editor-overlay">
                <div className="editor-modal">
                    <div className="modal-header">
                        <h2>Gerenciar Categorias</h2>
                        <button
                            type="button"
                            className="close-btn"
                            onClick={() => setShowCategoryManager(false)}
                        >
                            ×
                        </button>
                    </div>
                    <CategoryManager
                        boardId={boardId}
                        onCategoryChange={handleCategoryChange}
                    />
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => setShowCategoryManager(false)}
                        >
                            Voltar para Tarefa
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="editor-overlay">
            <div className="editor-modal">
                <h2>Criar Nova Tarefa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Título*</label>
                        <input
                            type="text"
                            name="title"
                            value={taskData.title}
                            onChange={handleChange}
                            placeholder="Título da tarefa"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            name="description"
                            value={taskData.description}
                            onChange={handleChange}
                            placeholder="Detalhes da tarefa..."
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <div className="category-header">
                            <label>Categoria*</label>
                            <button
                                type="button"
                                className="manage-categories-btn"
                                onClick={() => setShowCategoryManager(true)}
                            >
                                Gerenciar Categorias
                            </button>
                        </div>
                        <select
                            name="category_id"
                            value={taskData.category_id}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Responsável</label>
                        {/* <select name="assigned_to" value={taskData.assigned_to} onChange={handleChange} disabled={loading}>
              <option value="">Sem responsável</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select> */}
                    </div>

                    <div className="form-group">
                        <label>Status*</label>
                        <select
                            name="status"
                            value={taskData.status}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={
                                loading ||
                                !taskData.title ||
                                !taskData.category_id
                            }
                        >
                            {loading ? "Salvando..." : "Salvar Tarefa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
