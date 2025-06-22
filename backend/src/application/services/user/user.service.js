import { supabase } from "../../../config/db.js";

export class UserService {
    async findByEmail(email) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        return data;
    }

    async findById(id) {
        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, created_at")
            .eq("id", id)
            .single();

        if (error) throw new Error("Erro ao buscar usuário: " + error.message);
        return data;
    }

    async create(userData) {
        const { data, error } = await supabase
            .from("users")
            .insert([userData])
            .select()
            .single();

        if (error) throw new Error("Erro ao criar usuário: " + error.message);
        return data;
    }

    async updateProfile(id, userData) {
        const { password_hash, ...safeUserData } = userData;

        const { data, error } = await supabase
            .from("users")
            .update(safeUserData)
            .eq("id", id)
            .select("id, name, email, created_at")
            .single();

        if (error)
            throw new Error("Erro ao atualizar perfil: " + error.message);
        return data;
    }

    async updatePassword(id, newPassword) {
        const { error } = await supabase
            .from("users")
            .update({ password_hash: newPassword })
            .eq("id", id);

        if (error) throw new Error("Erro ao atualizar senha: " + error.message);
        return { message: "Senha atualizada com sucesso" };
    }

    async verifyPassword(id, currentPassword) {
        const { data, error } = await supabase
            .from("users")
            .select("password_hash")
            .eq("id", id)
            .single();

        if (error) throw new Error("Erro ao verificar senha: " + error.message);

        return data.password_hash === currentPassword;
    }

    async checkEmailExists(email, excludeId = null) {
        let query = supabase.from("users").select("id").eq("email", email);

        if (excludeId) {
            query = query.neq("id", excludeId);
        }

        const { data, error } = await query.single();

        if (error && error.code !== "PGRST116") {
            throw new Error("Erro ao verificar email: " + error.message);
        }

        return !!data;
    }

    async deleteAccount(id) {
        const { error } = await supabase.from("users").delete().eq("id", id);

        if (error) throw new Error("Erro ao deletar conta: " + error.message);
        return { message: "Conta deletada com sucesso" };
    }

    async list() {
        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, created_at")
            .order("name");

        if (error) throw new Error("Erro ao listar usuários: " + error.message);
        return data;
    }

    async get(id) {
        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, created_at")
            .eq("id", id)
            .single();

        if (error) throw new Error("Erro ao buscar usuário: " + error.message);
        return data;
    }

    async update(id, userData) {
        const { data, error } = await supabase
            .from("users")
            .update(userData)
            .eq("id", id)
            .select("id, name, email, created_at")
            .single();

        if (error)
            throw new Error("Erro ao atualizar usuário: " + error.message);
        return data;
    }

    async delete(id) {
        const { error } = await supabase.from("users").delete().eq("id", id);

        if (error) throw new Error("Erro ao deletar usuário: " + error.message);
        return { message: "Usuário deletado com sucesso" };
    }
}
