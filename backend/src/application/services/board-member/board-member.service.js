import { supabase } from "../../../config/db.js";

export class BoardMemberService {
  // Adiciona um usuário ao board
  async addMember(boardId, userId, role = "member") {
    const { data, error } = await supabase
      .from("board_members")
      .insert([{ board_id: boardId, user_id: userId, role }])
      .select()
      .single();

    if (error) throw new Error("Erro ao adicionar membro: " + error.message);
    return data;
  }

  // Remove um usuário do board
  async removeMember(boardId, userId) {
    const { error } = await supabase.from("board_members").delete().eq("board_id", boardId).eq("user_id", userId);

    if (error) throw new Error("Erro ao remover membro: " + error.message);
    return true;
  }

  // Lista membros de um board
  async listMembers(boardId) {
    const { data, error } = await supabase
      .from("board_members")
      .select("user_id, role, joined_at, users(name, email)") // usando foreign table users
      .eq("board_id", boardId);

    if (error) throw new Error("Erro ao listar membros: " + error.message);
    return data;
  }

  async isMemberInBoard(boardId, userId) {
    const { data, error } = await supabase
      .from("board_members")
      .select("*")
      .eq("board_id", boardId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw new Error("Erro ao verificar membro: " + error.message);
    return !!data;
  }
}
