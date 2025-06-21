import { useState, useEffect } from "react";
import CategoryManager from "../../CategoryManager.js";
import "./TaskEditor.css";

export default function TaskEditor({
    onSave,
    onCancel,
    boardId,
    defaultStatus = "PENDENTE",
    editingTask = null,
}) {
    const [taskData, setTaskData] = useState(() => {
        if (editingTask) {
            // Corrigir problema de fuso horário na data
            let formattedDate = "";
            if (editingTask.due_date) {
                // Usar a data diretamente do backend sem conversão
                formattedDate = editingTask.due_date;
            }

            return {
                title: editingTask.title || "",
                description: editingTask.description || "",
                status: editingTask.status || defaultStatus,
                category_id: editingTask.category_id || "",
                assigned_to: editingTask.assigned_to || "",
                due_date: formattedDate,
                due_time: editingTask.due_time || "",
                priority: editingTask.priority || "",
            };
        } else {
            return {
                title: "",
                description: "",
                status: defaultStatus,
                category_id: "",
                assigned_to: "",
                due_date: "",
                due_time: "",
                priority: "",
            };
        }
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

    // Atualizar dados quando editingTask mudar
    useEffect(() => {
        if (editingTask) {
            // Corrigir problema de fuso horário na data
            let formattedDate = "";
            if (editingTask.due_date) {
                // Usar a data diretamente do backend sem conversão
                formattedDate = editingTask.due_date;
            }

            setTaskData({
                title: editingTask.title || "",
                description: editingTask.description || "",
                status: editingTask.status || defaultStatus,
                category_id: editingTask.category_id || "",
                assigned_to: editingTask.assigned_to || "",
                due_date: formattedDate,
                due_time: editingTask.due_time || "",
                priority: editingTask.priority || "",
            });
        } else {
            setTaskData({
                title: "",
                description: "",
                status: defaultStatus,
                category_id: "",
                assigned_to: "",
                due_date: "",
                due_time: "",
                priority: "",
            });
        }
    }, [editingTask, defaultStatus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        // Preparar payload com tratamento correto de campos vazios
        const payload = {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            category_id: taskData.category_id,
            assigned_to: taskData.assigned_to || null,
            due_date:
                taskData.due_date && taskData.due_date.trim() !== ""
                    ? taskData.due_date
                    : null,
            due_time:
                taskData.due_time && taskData.due_time.trim() !== ""
                    ? taskData.due_time.split(":").slice(0, 2).join(":")
                    : null,
            priority:
                taskData.priority && taskData.priority.trim() !== ""
                    ? taskData.priority
                    : null,
        };

        try {
            let response;
            if (editingTask) {
                // Atualizando tarefa existente
                response = await fetch(
                    `http://localhost:3001/api/tasks/${editingTask.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                    }
                );
            } else {
                // Criando nova tarefa
                response = await fetch(
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
            }

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao salvar a tarefa");
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
                <h2>{editingTask ? "Editar Tarefa" : "Criar Nova Tarefa"}</h2>
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

                    <div className="form-row">
                        <div className="form-group">
                            <label>Data de Vencimento</label>
                            <input
                                type="date"
                                name="due_date"
                                value={taskData.due_date}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Hora de Vencimento</label>
                            <input
                                type="time"
                                name="due_time"
                                value={taskData.due_time}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Prioridade</label>
                        <select
                            name="priority"
                            value={taskData.priority}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Selecione uma prioridade</option>
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                        </select>
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
                            {loading
                                ? "Salvando..."
                                : editingTask
                                ? "Atualizar Tarefa"
                                : "Salvar Tarefa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
