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

  useEffect(() => {
    if (!boardId) {
      setTasks([]);
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/api/boards/${boardId}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => setTasks([]));
  }, [boardId]);

  const statuses = ["PENDENTE", "EM ANDAMENTO", "CONCLUÍDO"];

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    // Aqui também pode enviar delete para o backend
    // fetch(`http://localhost:3001/api/tasks/${id}`, { method: 'DELETE', headers: ... })
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

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (!draggedTask) return;

    // Atualiza localmente
    const updatedTasks = tasks.map((task) => (task.id === draggedTask.id ? { ...task, status: targetStatus } : task));
    setTasks(updatedTasks);
    setDraggedTask(null);

    // Atualiza no backend
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/api/tasks/${draggedTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: targetStatus }),
    }).catch(() => {
      // Reverter se quiser
      setTasks(tasks);
    });
  };

  const handleAddClick = (status) => {
    setEditingStatus(status);
    setShowEditor(true);
  };

  const handleSave = (newTask) => {
    // Atualiza localmente
    setTasks((prev) => [...prev, newTask]);
    setShowEditor(false);
    setEditingStatus(null);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingStatus(null);
  };

  return (
    <div className="task-board">
      {/* Editor */}
      {showEditor && (
        <div className="editor-overlay">
          <div className="editor-modal">
            <TaskEditor defaultStatus={editingStatus} boardId={boardId} onSave={handleSave} onCancel={handleCancel} />
          </div>
        </div>
      )}

      {/* Colunas */}
      {statuses.map((status) => {
        const filteredTasks = tasks.filter((task) => task.status === status);

        return (
          <div
            key={status}
            className="task-column"
            onDragOver={(e) => handleDragOver(e, status)}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h3>{status}</h3>

            {filteredTasks.map((task) => (
              <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task)}>
                <TaskCard task={task} onDelete={handleDeleteTask} />
              </div>
            ))}

            <AddTaskCard onClick={() => handleAddClick(status)} />
          </div>
        );
      })}
    </div>
  );
}
