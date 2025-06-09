import { FiX, FiTrash } from "react-icons/fi"; // For the red "X"
import "./TaskCard.css";

export default function TaskCard({ task, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-header">
        <strong>{task.title}</strong>
        <FiX className="delete-icon" onClick={() => onDelete(task.id)} />
      </div>
      <p>{task.description}</p>
      <div className="task-info">
        <span className="task-date">{new Date(task.date).toLocaleDateString("pt-BR")}</span>{" "}
        <span className="task-time">{task.time}</span>
      </div>
      <div className="task-meta">
        <span className="dot" />
        <span className="category">{task.category}</span>
        <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority.toUpperCase()}</span>
      </div>
    </div>
  );
}
