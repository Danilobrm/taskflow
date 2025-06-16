import { supabase } from "../../../config/db.js";

export class BoardService {
  async create(boardData) {
    const { data, error } = await supabase.from("boards").insert([boardData]).select().single();

    if (error) throw new Error("Erro ao criar quadro: " + error.message);
    return data;
  }

  async list(userId) {
    const { data, error } = await supabase.from("board_members").select("board_id").eq("user_id", userId);

    if (error) throw new Error("Erro ao listar quadros: " + error.message);

    const boardIds = data.map((item) => item.board_id);
    if (boardIds.length === 0) return [];

    const { data: boards, error: boardsError } = await supabase.from("boards").select("*").in("id", boardIds);
    if (boardsError) throw new Error("Erro ao buscar quadros: " + boardsError.message);

    return boards;
  }

  async getById(boardId) {
    const { data, error } = await supabase.from("boards").select("*").eq("id", boardId).single();

    if (error) throw new Error("Erro ao buscar quadro: " + error.message);
    return data;
  }

  async update(boardId, boardData) {
    const { data, error } = await supabase.from("boards").update(boardData).eq("id", boardId).select().single();

    if (error) throw new Error("Erro ao atualizar quadro: " + error.message);
    return data;
  }

  async delete(boardId) {
    const { error } = await supabase.from("boards").delete().eq("id", boardId);

    if (error) throw new Error("Erro ao deletar quadro: " + error.message);
    return { success: true };
  }
}
