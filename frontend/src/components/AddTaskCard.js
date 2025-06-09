export default function AddTaskCard({ onClick }) {
  return (
    <div className="add-task-card cursor-pointer" onClick={onClick}>
      <span className="plus-icon">＋</span> Adicionar tarefa
    </div>
  );
}
