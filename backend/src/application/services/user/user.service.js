import { supabase } from "../../../config/db.js";

export class UserService {
  async findByEmail(email) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single();

    return data;
  }

  async create(userData) {
    const { data, error } = await supabase.from("users").insert([userData]).select().single();

    if (error) throw new Error("Erro ao criar usuário: " + error.message);
    return data;
  }
}
