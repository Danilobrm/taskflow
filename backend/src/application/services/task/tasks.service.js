import { supabase } from "../../../config/db.js";

export class TaskService {
    async create(boardId, taskData) {
        // Validações básicas
        if (!boardId) {
            throw new Error("ID do quadro é obrigatório");
        }

        if (!taskData.title || taskData.title.trim() === "") {
            throw new Error("Título da tarefa é obrigatório");
        }

        // Tratar data para evitar problemas de fuso horário
        let dueDate = null;
        if (taskData.due_date) {
            // Usar a data diretamente sem conversão UTC
            dueDate = taskData.due_date;
        }

        const { data, error } = await supabase
            .from("tasks")
            .insert([
                {
                    ...taskData,
                    board_id: boardId,
                    title: taskData.title.trim(),
                    description: taskData.description?.trim() || null,
                    status: taskData.status || "PENDENTE",
                    due_date: dueDate,
                    due_time: taskData.due_time || null,
                    priority: taskData.priority || null,
                },
            ])
            .select()
            .single();

        if (error) {
            if (error.code === "23503") {
                throw new Error("Quadro ou categoria não encontrada");
            }
            throw new Error("Erro ao criar tarefa: " + error.message);
        }
        return data;
    }

    async listByBoard(boardId) {
        if (!boardId) {
            throw new Error("ID do quadro é obrigatório");
        }

        const { data, error } = await supabase
            .from("tasks")
            .select(
                `
        *,
        categories (
          id,
          name,
          color
        )
      `
            )
            .eq("board_id", boardId)
            .order("created_at", { ascending: false });

        if (error) throw new Error("Erro ao listar tarefas: " + error.message);
        return data;
    }

    async getById(taskId) {
        if (!taskId) {
            throw new Error("ID da tarefa é obrigatório");
        }

        const { data, error } = await supabase
            .from("tasks")
            .select(
                `
        *,
        categories (
          id,
          name,
          color
        )
      `
            )
            .eq("id", taskId)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                throw new Error("Tarefa não encontrada");
            }
            throw new Error("Erro ao buscar tarefa: " + error.message);
        }
        return data;
    }

    async update(taskId, taskData) {
        if (!taskId) {
            throw new Error("ID da tarefa é obrigatório");
        }

        // Validações básicas
        if (
            taskData.title !== undefined &&
            (!taskData.title || taskData.title.trim() === "")
        ) {
            throw new Error("Título da tarefa não pode estar vazio");
        }

        const updateData = { ...taskData };
        if (updateData.title) {
            updateData.title = updateData.title.trim();
        }
        if (updateData.description !== undefined) {
            updateData.description = updateData.description?.trim() || null;
        }

        // Tratar data para evitar problemas de fuso horário
        if (updateData.due_date !== undefined) {
            if (updateData.due_date) {
                // Usar a data diretamente sem conversão UTC
                updateData.due_date = updateData.due_date;
            } else {
                updateData.due_date = null;
            }
        }

        if (updateData.due_time !== undefined) {
            updateData.due_time = updateData.due_time || null;
        }

        if (updateData.priority !== undefined) {
            updateData.priority = updateData.priority || null;
        }

        const { data, error } = await supabase
            .from("tasks")
            .update(updateData)
            .eq("id", taskId)
            .select(
                `
        *,
        categories (
          id,
          name,
          color
        )
      `
            )
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                throw new Error("Tarefa não encontrada");
            }
            if (error.code === "23503") {
                throw new Error("Categoria não encontrada");
            }
            throw new Error("Erro ao atualizar tarefa: " + error.message);
        }
        return data;
    }

    async delete(taskId) {
        if (!taskId) {
            throw new Error("ID da tarefa é obrigatório");
        }

        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId);

        if (error) {
            if (error.code === "PGRST116") {
                throw new Error("Tarefa não encontrada");
            }
            throw new Error("Erro ao deletar tarefa: " + error.message);
        }
        return { success: true };
    }
}
