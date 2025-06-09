import { createServer } from "node:http";
import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

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
