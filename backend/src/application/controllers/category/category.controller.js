import { CategoryService } from "../../services/category/category.service.js";

export class CategoryController {
    constructor() {
        this.categoryService = new CategoryService();
    }

    async create(req, res) {
        const { boardId } = req.params;
        const { name, color } = req.body;

        if (!name) {
            return res
                .status(400)
                .json({ error: "Nome da categoria é obrigatório." });
        }

        try {
            const category = await this.categoryService.create({
                name,
                color: color || null,
                board_id: boardId,
            });

            return res.status(201).json(category);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async listByBoard(req, res) {
        const { boardId } = req.params;

        try {
            const categories = await this.categoryService.listByBoard(boardId);
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async get(req, res) {
        const { id } = req.params;

        try {
            const category = await this.categoryService.getById(id);

            if (!category) {
                return res
                    .status(404)
                    .json({ error: "Categoria não encontrada." });
            }

            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.name && updateData.name.trim() === "") {
            return res
                .status(400)
                .json({ error: "Nome da categoria não pode estar vazio." });
        }

        try {
            const updatedCategory = await this.categoryService.update(
                id,
                updateData
            );
            return res.status(200).json(updatedCategory);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        const { id } = req.params;

        try {
            await this.categoryService.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
