import { useEffect, useState } from "react";
import AddTaskCard from "./add/AddTaskCard";
import TaskEditor from "./add/TaskEditor";
import TaskCard from "./card/TaskCard";
import "./TaskBoard.css";

export default function TaskBoard({ boardId }) {
    const [tasks, setTasks] = useState([]);
    const [editingStatus, setEditingStatus] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!boardId) {
            setTasks([]);
            return;
        }

        fetchTasks();
    }, [boardId]);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/boards/${boardId}/tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao carregar tarefas");
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
            setTasks([]);
        }
    };

    const statuses = ["PENDENTE", "EM ANDAMENTO", "CONCLUÍDO"];

    const handleDeleteTask = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/tasks/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao excluir tarefa");
            }

            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
            alert("Erro ao excluir tarefa. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowEditor(true);
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, status) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        if (!draggedTask) return;

        // Atualiza localmente primeiro para feedback imediato
        const updatedTasks = tasks.map((task) =>
            task.id === draggedTask.id
                ? { ...task, status: targetStatus }
                : task
        );
        setTasks(updatedTasks);
        setDraggedTask(null);

        // Atualiza no backend
        try {
            const token = localStorage.getItem("token");
            const updatedTask = { status: targetStatus };
            const response = await fetch(
                `http://localhost:3001/api/tasks/${draggedTask.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedTask),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao atualizar status");
            }
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            // Reverter mudança local em caso de erro
            setTasks(tasks);
            alert("Erro ao atualizar status da tarefa. Tente novamente.");
        }
    };

    const handleAddClick = (status) => {
        setEditingStatus(status);
        setEditingTask(null);
        setShowEditor(true);
    };

    const handleSave = (savedTask) => {
        if (editingTask) {
            // Atualizando tarefa existente
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === savedTask.id ? savedTask : task
                )
            );
        } else {
            // Criando nova tarefa
            setTasks((prev) => [...prev, savedTask]);
        }
        setShowEditor(false);
        setEditingStatus(null);
        setEditingTask(null);
    };

    const handleCancel = () => {
        setShowEditor(false);
        setEditingStatus(null);
        setEditingTask(null);
    };

    return (
        <div className="task-board">
            {/* Editor */}
            {showEditor && (
                <div className="editor-overlay">
                    <div className="editor-modal">
                        <TaskEditor
                            defaultStatus={editingStatus}
                            boardId={boardId}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            editingTask={editingTask}
                        />
                    </div>
                </div>
            )}

            {/* Colunas */}
            {statuses.map((status) => {
                const filteredTasks = tasks.filter(
                    (task) => task.status === status
                );

                return (
                    <div
                        key={status}
                        className="task-column"
                        onDragOver={(e) => handleDragOver(e, status)}
                        onDrop={(e) => handleDrop(e, status)}
                    >
                        <h3>{status}</h3>

                        {filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                            >
                                <TaskCard
                                    task={task}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleEditTask}
                                />
                            </div>
                        ))}

                        <AddTaskCard onClick={() => handleAddClick(status)} />
                    </div>
                );
            })}
        </div>
    );
}
