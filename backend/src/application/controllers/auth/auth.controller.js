import { AuthService } from "../../services/auth/auth.service.js";
import jwt from "jsonwebtoken";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      const existingUser = await this.authService.userService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Usuário já existe." });
      }
    } catch (err) {
      // Ignora erro se não encontrar usuário
    }

    try {
      const user = await this.authService.register({ name, email, password });
      return res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const result = await this.authService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req, res) {
    console.log("getProfile called with user ID:", req.user.id);
    try {
      const user = await this.authService.userService.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      return res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }

  autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token não fornecido." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Token inválido." });
      req.user = user;
      next();
    });
  }
}
