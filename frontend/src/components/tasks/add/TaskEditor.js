import { useState } from "react";
import "./TaskEditor.css"; // We'll create this CSS file

export default function TaskEditor({ onSave, onCancel, defaultStatus }) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0], // Default to today
    time: "12:00",
    category: "Trabalho",
    priority: "média",
    status: defaultStatus || "PENDENTE"
  });

  const categories = ["Trabalho", "Pessoal", "Academia", "Estudos", "Lazer"];
  const priorities = [
    { value: "alta", label: "Alta Prioridade" },
    { value: "média", label: "Média Prioridade" },
    { value: "baixa", label: "Baixa Prioridade" }
  ];
  const statuses = ["PENDENTE", "EM ANDAMENTO", "CONCLUÍDO"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...taskData,
      id: Date.now(),
      // Combine date and time for a complete timestamp if needed
      fullDate: `${taskData.date}T${taskData.time}:00.000Z`
    });
  };

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
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data*</label>
              <input
                type="date"
                name="date"
                value={taskData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora*</label>
              <input
                type="time"
                name="time"
                value={taskData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoria</label>
              <select
                name="category"
                value={taskData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Prioridade</label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
              >
                {priorities.map(pri => (
                  <option key={pri.value} value={pri.value}>{pri.label}</option>
                ))}
              </select>
            </div>
          </div>

          {defaultStatus === undefined && (
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Salvar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}