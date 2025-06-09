import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());

let tasks = [];

app.post("/tasks", (req, res) => {
  const { title, description, date, priority, category } = req.body;
  const now = new Date();
  const inputDate = new Date(date);

  if (!title || !date) return res.status(400).json({ error: "Título e data são obrigatórios" });
  if (title.length > 100) return res.status(400).json({ error: "Título muito longo" });
  if (inputDate < now) return res.status(400).json({ error: "A data não pode ser anterior a hoje" });
  if (!["Alta", "Média", "Baixa"].includes(priority)) return res.status(400).json({ error: "Prioridade inválida" });

  const duplicate = tasks.find((t) => t.title === title && t.date === date);
  if (duplicate) return res.status(400).json({ error: "Já existe uma tarefa com esse título e data" });

  const task = {
    id: uuidv4(),
    title,
    description,
    date,
    priority,
    category: category || "sem classificação",
    status: "Pendente",
  };

  tasks.push(task);
  res.status(201).json(task);
});

// List Tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.listen(port, "localhost", () => {
  console.log("Running on http://localhost:" + port);
});
