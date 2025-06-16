import { FiX } from "react-icons/fi"; // For the red "X"
import "./TaskCard.css";

export default function TaskCard({ task, onDelete }) {
  const formattedDate = task.date ? new Date(task.date).toLocaleDateString("pt-BR") : "Data não informada";

  const formattedTime = task.time || "Hora não informada";

  // Optional: show status in a colored pill
  const statusColors = {
    PENDENTE: "#f59e0b", // amber
    "EM ANDAMENTO": "#3b82f6", // blue
    CONCLUÍDO: "#10b981", // green
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <strong className="task-title">{task.title || "Sem título"}</strong>
        <FiX className="delete-icon" onClick={() => onDelete(task.id)} title="Excluir tarefa" />
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-info">
        <span className="task-date">{formattedDate}</span>
        <span className="task-time">{formattedTime}</span>
      </div>

      <div className="task-meta">
        <span
          className="status-pill"
          style={{ backgroundColor: statusColors[task.status] || "#888" }}
          title={`Status: ${task.status}`}
        >
          {task.status || "SEM STATUS"}
        </span>

        <span className="dot" />

        <span className="category">{task.category || "Sem categoria"}</span>

        {task.assigned_to_name && (
          <>
            <span className="dot" />
            <span className="assigned-to" title={`Responsável: ${task.assigned_to_name}`}>
              {task.assigned_to_name}
            </span>
          </>
        )}

        {task.priority && (
          <>
            <span className="dot" />
            <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority.toUpperCase()}</span>
          </>
        )}
      </div>
    </div>
  );
}
