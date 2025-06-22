import { AuthService } from "../../services/auth/auth.service.js";
import jwt from "jsonwebtoken";
import { supabase } from "../../../config/db.js";

export class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async register(req, res) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Todos os campos são obrigatórios." });
        }

        try {
            const existingUser = await this.authService.userService.findByEmail(
                email
            );
            if (existingUser) {
                return res.status(409).json({ error: "Usuário já existe." });
            }
        } catch (err) {
            // Ignora erro se não encontrar usuário
        }

        try {
            const user = await this.authService.register({
                name,
                email,
                password,
            });
            return res
                .status(201)
                .json({ message: "Usuário registrado com sucesso!" });
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
        console.log("getProfile called with user ID:", req.user?.id);

        if (!req.user || !req.user.id) {
            console.log("No user found in request");
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        try {
            const user = await this.authService.userService.findById(
                req.user.id
            );
            if (!user) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }
            return res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
            });
        } catch (error) {
            console.log("Error in getProfile:", error);
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    }

    async updateProfile(req, res) {
        const { name, email } = req.body;
        const userId = req.user.id;

        try {
            if (!name || !email) {
                return res
                    .status(400)
                    .json({ error: "Nome e email são obrigatórios." });
            }

            // Verificar se o email já existe (excluindo o usuário atual)
            const emailExists =
                await this.authService.userService.checkEmailExists(
                    email,
                    userId
                );
            if (emailExists) {
                return res.status(409).json({
                    error: "Este email já está em uso por outro usuário.",
                });
            }

            const userData = { name, email };
            const user = await this.authService.userService.updateProfile(
                userId,
                userData
            );

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updatePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        try {
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    error: "Senha atual e nova senha são obrigatórias.",
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: "A nova senha deve ter pelo menos 6 caracteres.",
                });
            }

            // Verificar se a senha atual está correta
            const isPasswordCorrect =
                await this.authService.userService.verifyPassword(
                    userId,
                    currentPassword
                );
            if (!isPasswordCorrect) {
                return res
                    .status(400)
                    .json({ error: "Senha atual incorreta." });
            }

            // Atualizar senha
            const result = await this.authService.userService.updatePassword(
                userId,
                newPassword
            );

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    autenticarToken(req, res, next) {
        const authHeader = req.headers["authorization"];
        console.log("Auth header:", authHeader);

        const token = authHeader && authHeader.split(" ")[1];
        console.log("Token extracted:", token ? "Token exists" : "No token");

        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ error: "Token não fornecido." });
        }

        const jwtSecret =
            process.env.JWT_SECRET || "dev-secret-key-change-in-production";
        console.log(
            "Using JWT secret:",
            jwtSecret ? "Secret exists" : "No secret"
        );

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                console.log("Token verification failed:", err.message);
                return res.status(403).json({ error: "Token inválido." });
            }
            console.log("Token verified, user:", user);
            req.user = user;
            next();
        });
    }
}
