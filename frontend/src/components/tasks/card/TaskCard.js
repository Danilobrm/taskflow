import { useState, useEffect } from "react";
import { FiX, FiEdit } from "react-icons/fi";
import "./TaskCard.css";

export default function TaskCard({ task, onDelete, onEdit }) {
    const [category, setCategory] = useState(null);

    // Formatação da data e hora de vencimento
    const formatDueDate = (dueDate) => {
        if (!dueDate) return null;

        try {
            // Usar a data diretamente do backend (formato YYYY-MM-DD)
            const [year, month, day] = dueDate.split("-");
            return `${day}/${month}/${year}`;
        } catch (error) {
            console.error("Erro ao formatar data:", error);
            return null;
        }
    };

    const formatDueTime = (dueTime) => {
        if (!dueTime) return null;

        try {
            // Remover milissegundos e mostrar apenas HH:MM
            return dueTime.split(":").slice(0, 2).join(":");
        } catch (error) {
            console.error("Erro ao formatar hora:", error);
            return null;
        }
    };

    const dueDate = formatDueDate(task.due_date);
    const dueTime = formatDueTime(task.due_time);

    // Optional: show status in a colored pill
    const statusColors = {
        PENDENTE: "#f59e0b", // amber
        "EM ANDAMENTO": "#3b82f6", // blue
        CONCLUÍDO: "#10b981", // green
    };

    // Carregar informações da categoria
    useEffect(() => {
        const loadCategory = async () => {
            if (task.category_id) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(
                        `http://localhost:3001/api/categories/${task.category_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.ok) {
                        const categoryData = await response.json();
                        setCategory(categoryData);
                    }
                } catch (err) {
                    console.error("Erro ao carregar categoria:", err);
                }
            }
        };

        loadCategory();
    }, [task.category_id]);

    return (
        <div className="task-card">
            <div className="task-header">
                <strong className="task-title">
                    {task.title || "Sem título"}
                </strong>
                <div className="task-actions">
                    <FiEdit
                        className="edit-icon"
                        onClick={() => onEdit(task)}
                        title="Editar tarefa"
                    />
                    <FiX
                        className="delete-icon"
                        onClick={() => onDelete(task.id)}
                        title="Excluir tarefa"
                    />
                </div>
            </div>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            {/* Data e hora de vencimento */}
            {(dueDate || dueTime) && (
                <div className="task-due-info">
                    {dueDate && (
                        <span className="task-due-date">📅 {dueDate}</span>
                    )}
                    {dueTime && (
                        <span className="task-due-time">🕐 {dueTime}</span>
                    )}
                </div>
            )}

            <div className="task-meta">
                <span
                    className="status-pill"
                    style={{
                        backgroundColor: statusColors[task.status] || "#888",
                    }}
                    title={`Status: ${task.status}`}
                >
                    {task.status || "SEM STATUS"}
                </span>

                {category && (
                    <>
                        <span className="dot" />
                        <span
                            className="category-pill"
                            style={{
                                backgroundColor: category.color || "#3B82F6",
                                color: "white",
                            }}
                            title={`Categoria: ${category.name}`}
                        >
                            {category.name}
                        </span>
                    </>
                )}

                {task.assigned_to_name && (
                    <>
                        <span className="dot" />
                        <span
                            className="assigned-to"
                            title={`Responsável: ${task.assigned_to_name}`}
                        >
                            {task.assigned_to_name}
                        </span>
                    </>
                )}

                {task.priority && (
                    <>
                        <span className="dot" />
                        <span
                            className={`priority ${task.priority.toLowerCase()}`}
                        >
                            {task.priority.toUpperCase()}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
