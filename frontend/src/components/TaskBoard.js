import { useEffect, useState } from "react";
import AddTaskCard from "./AddTaskCard";
import TaskEditor from "./TaskEditor";
import TaskCard from "./TaskCard";
import "./TaskBoard.css";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [editingStatus, setEditingStatus] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const statuses = ["PENDENTE", "EM ANDAMENTO", "CONCLUÍDO"];

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
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

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTask.id ? { ...task, status: targetStatus } : task
    );

    setTasks(updatedTasks);
    setDraggedTask(null);
  };

  const handleAddClick = (status) => {
    setEditingStatus(status);
    setShowEditor(true);
  };

  const handleSave = (newTask) => {
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
      {/* Task Editor Overlay */}
      {showEditor && (
        <div className="editor-overlay">
          <div className="editor-modal">
            <TaskEditor
              defaultStatus={editingStatus}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Task Columns */}
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
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
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