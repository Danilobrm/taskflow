import { TaskService } from "../../services/task/tasks.service.js";

export class TaskController {
    constructor() {
        this.taskService = new TaskService();
    }

    async create(req, res) {
        const { boardId } = req.params;
        const {
            title,
            description,
            status,
            category_id,
            due_date,
            due_time,
            priority,
        } = req.body;

        // Validações
        if (!title || title.trim() === "") {
            return res
                .status(400)
                .json({ error: "O título da tarefa é obrigatório." });
        }

        if (!category_id) {
            return res
                .status(400)
                .json({ error: "A categoria da tarefa é obrigatória." });
        }

        if (
            status &&
            ![
                "PENDENTE",
                "EM ANDAMENTO",
                "CONCLUÍDO",
                "open",
                "in_progress",
                "completed",
            ].includes(status)
        ) {
            return res.status(400).json({
                error: "Status inválido. Use: PENDENTE, EM ANDAMENTO ou CONCLUÍDO.",
            });
        }

        // Validação de prioridade
        if (
            priority &&
            !["baixa", "media", "alta"].includes(priority.toLowerCase())
        ) {
            return res.status(400).json({
                error: "Prioridade inválida. Use: baixa, media ou alta.",
            });
        }

        // Validação de data
        if (due_date) {
            // Validar formato YYYY-MM-DD
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(due_date)) {
                return res
                    .status(400)
                    .json({ error: "Data inválida. Use formato YYYY-MM-DD." });
            }
        }

        // Validação de hora - só valida se houver um valor não vazio
        if (
            due_time &&
            typeof due_time === "string" &&
            due_time.trim() !== ""
        ) {
            // Aceitar formato HH:MM ou HH:MM:SS
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
            if (!timeRegex.test(due_time)) {
                return res.status(400).json({
                    error: "Hora inválida. Use formato HH:MM ou HH:MM:SS.",
                });
            }
        }

        try {
            const task = await this.taskService.create(boardId, {
                title: title.trim(),
                description: description?.trim() || null,
                status: status || "PENDENTE",
                category_id,
                due_date: due_date || null,
                due_time: due_time || null,
                priority: priority ? priority.toLowerCase() : null,
            });

            return res.status(201).json(task);
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async listByBoard(req, res) {
        const { boardId } = req.params;

        if (!boardId) {
            return res
                .status(400)
                .json({ error: "ID do quadro é obrigatório." });
        }

        try {
            const tasks = await this.taskService.listByBoard(boardId);
            return res.status(200).json(tasks);
        } catch (error) {
            console.error("Erro ao listar tarefas:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async get(req, res) {
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ error: "ID da tarefa é obrigatório." });
        }

        try {
            const task = await this.taskService.getById(id);

            if (!task) {
                return res
                    .status(404)
                    .json({ error: "Tarefa não encontrada." });
            }

            return res.status(200).json(task);
        } catch (error) {
            console.error("Erro ao buscar tarefa:", error);
            if (error.message.includes("não encontrada")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res
                .status(400)
                .json({ error: "ID da tarefa é obrigatório." });
        }

        // Validações
        if (
            updateData.title !== undefined &&
            (!updateData.title || updateData.title.trim() === "")
        ) {
            return res
                .status(400)
                .json({ error: "O título da tarefa não pode estar vazio." });
        }

        if (
            updateData.status &&
            ![
                "PENDENTE",
                "EM ANDAMENTO",
                "CONCLUÍDO",
                "open",
                "in_progress",
                "completed",
            ].includes(updateData.status)
        ) {
            return res.status(400).json({
                error: "Status inválido. Use: PENDENTE, EM ANDAMENTO ou CONCLUÍDO.",
            });
        }

        // Validação de prioridade
        if (
            updateData.priority &&
            !["baixa", "media", "alta"].includes(
                updateData.priority.toLowerCase()
            )
        ) {
            return res
                .status(400)
                .json({
                    error: "Prioridade inválida. Use: baixa, media ou alta.",
                });
        }

        // Validação de data
        if (updateData.due_date !== undefined) {
            if (updateData.due_date) {
                // Validar formato YYYY-MM-DD
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(updateData.due_date)) {
                    return res
                        .status(400)
                        .json({
                            error: "Data inválida. Use formato YYYY-MM-DD.",
                        });
                }
            }
        }

        // Validação de hora - só valida se houver um valor não vazio
        if (
            updateData.due_time &&
            typeof updateData.due_time === "string" &&
            updateData.due_time.trim() !== ""
        ) {
            // Aceitar formato HH:MM ou HH:MM:SS
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
            if (!timeRegex.test(updateData.due_time)) {
                return res.status(400).json({
                    error: "Hora inválida. Use formato HH:MM ou HH:MM:SS.",
                });
            }
        }

        try {
            const updatedTask = await this.taskService.update(id, updateData);
            return res.status(200).json(updatedTask);
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            if (error.message.includes("não encontrada")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ error: "ID da tarefa é obrigatório." });
        }

        try {
            await this.taskService.delete(id);
            return res.status(204).send();
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
            if (error.message.includes("não encontrada")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}
