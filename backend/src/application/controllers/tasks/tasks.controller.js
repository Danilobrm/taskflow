import { TaskService } from "../../services/task/tasks.service.js";

export class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  async create(req, res) {
    const { boardId } = req.params;
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "O título da tarefa é obrigatório." });
    }

    try {
      const task = await this.taskService.create(boardId, {
        title,
        description: description || null,
        status: status || "pending",
      });

      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async listByBoard(req, res) {
    const { boardId } = req.params;

    try {
      const tasks = await this.taskService.listByBoard(boardId);
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async get(req, res) {
    const { id } = req.params;

    try {
      const task = await this.taskService.getById(id);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada." });
      }

      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedTask = await this.taskService.update(id, updateData);

      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      await this.taskService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
