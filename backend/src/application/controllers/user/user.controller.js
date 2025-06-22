import { UserService } from "../../services/user/user.service.js";

export class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async getUserByEmail(req, res) {
        const { email } = req.body;

        try {
            const user = await this.userService.findByEmail(email);

            if (!user) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado." });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        const { name, email } = req.body;

        try {
            if (!name || !email) {
                return res
                    .status(400)
                    .json({ error: "Nome e email são obrigatórios." });
            }

            const userData = { name, email };
            const user = await this.userService.create(userData);

            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async list(req, res) {
        try {
            const users = await this.userService.list();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async get(req, res) {
        const { id } = req.params;

        try {
            const user = await this.userService.get(id);

            if (!user) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado." });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, email } = req.body;

        try {
            if (!name || !email) {
                return res
                    .status(400)
                    .json({ error: "Nome e email são obrigatórios." });
            }

            const userData = { name, email, updated_at: new Date() };
            const user = await this.userService.update(id, userData);

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        const { id } = req.params;

        try {
            const result = await this.userService.delete(id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
