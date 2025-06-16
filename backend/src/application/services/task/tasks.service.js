import { supabase } from "../../../config/db.js";

export class TaskService {
  async create(boardId, taskData) {
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ ...taskData, board_id: boardId }])
      .select()
      .single();

    if (error) throw new Error("Erro ao criar tarefa: " + error.message);
    return data;
  }

  async listByBoard(boardId) {
    const { data, error } = await supabase.from("tasks").select("*").eq("board_id", boardId);

    if (error) throw new Error("Erro ao listar tarefas: " + error.message);
    return data;
  }

  async getById(taskId) {
    const { data, error } = await supabase.from("tasks").select("*").eq("id", taskId).single();

    if (error) throw new Error("Erro ao buscar tarefa: " + error.message);
    return data;
  }

  async update(taskId, taskData) {
    const { data, error } = await supabase.from("tasks").update(taskData).eq("id", taskId).select().single();

    if (error) throw new Error("Erro ao atualizar tarefa: " + error.message);
    return data;
  }

  async delete(taskId) {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) throw new Error("Erro ao deletar tarefa: " + error.message);
    return { success: true };
  }
}
