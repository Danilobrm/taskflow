export default function AddTaskCard({ onClick }) {
  return (
    <div className="add-task-card cursor-pointer" style={{ width: "100%" }} onClick={onClick}>
      <span className="plus-icon">＋</span> Adicionar tarefa
    </div>
  );
}
