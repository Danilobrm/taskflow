import { supabase } from "../../../config/db.js";

export class CategoryService {
    async create(categoryData) {
        const { data, error } = await supabase
            .from("categories")
            .insert([categoryData])
            .select()
            .single();

        if (error) throw new Error("Erro ao criar categoria: " + error.message);
        return data;
    }

    async listByBoard(boardId) {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("board_id", boardId)
            .order("name");

        if (error)
            throw new Error("Erro ao listar categorias: " + error.message);
        return data;
    }

    async getById(categoryId) {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("id", categoryId)
            .single();

        if (error)
            throw new Error("Erro ao buscar categoria: " + error.message);
        return data;
    }

    async update(categoryId, categoryData) {
        const { data, error } = await supabase
            .from("categories")
            .update(categoryData)
            .eq("id", categoryId)
            .select()
            .single();

        if (error)
            throw new Error("Erro ao atualizar categoria: " + error.message);
        return data;
    }

    async delete(categoryId) {
        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", categoryId);

        if (error)
            throw new Error("Erro ao deletar categoria: " + error.message);
        return { success: true };
    }
}
