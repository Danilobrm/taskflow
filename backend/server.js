<<<<<<< HEAD
import { createServer } from "node:http";
=======
>>>>>>> 3e44f3c9fc6165f1b4106327b5090a9b1d5900e2
import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

<<<<<<< HEAD
app.use(cors()); // Adicionar middleware CORS
app.use(express.json()); // Adicionar middleware para analisar corpos de requisição JSON

const users = []; // Armazenamento de usuários em memória

app.post("/api/register", (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res
            .status(400)
            .json({ message: "Todos os campos são obrigatórios." });
    }

    if (users.find((user) => user.email === email)) {
        return res.status(409).json({ message: "E-mail já cadastrado." });
    }

    const newUser = { nome, email, senha }; // Em um cenário real, a senha seria hash
    users.push(newUser);
    console.log("Novo usuário registrado:", newUser);
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
});

app.post("/api/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res
            .status(400)
            .json({ message: "E-mail e senha são obrigatórios." });
    }

    const user = users.find(
        (user) => user.email === email && user.senha === senha
    ); // Em um cenário real, comparar senha hash

    if (user) {
        console.log("Usuário logado:", user.email);
        res.status(200).json({ message: "Login bem-sucedido!" });
    } else {
        res.status(401).json({ message: "E-mail ou senha inválidos." });
    }
});

app.get("/", (req, res) => {
    res.send("Olá Mundo!");
});

const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World!\n");
});

server.listen(port, "localhost", () => {
    console.log("Listening on localhost:3000");
});
=======
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
>>>>>>> 3e44f3c9fc6165f1b4106327b5090a9b1d5900e2
