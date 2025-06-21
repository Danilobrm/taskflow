import React, { useState, useEffect } from "react";
import "./CategoryManager.css";

export default function CategoryManager({ boardId, onCategoryChange }) {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        name: "",
        color: "#3B82F6",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingData, setEditingData] = useState({ name: "", color: "" });

    const defaultColors = [
        "#3B82F6",
        "#EF4444",
        "#10B981",
        "#F59E0B",
        "#8B5CF6",
        "#EC4899",
        "#06B6D4",
        "#84CC16",
    ];

    useEffect(() => {
        loadCategories();
    }, [boardId]);

    const loadCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/boards/${boardId}/categories`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const categoriesData = await response.json();
                setCategories(categoriesData);
                if (onCategoryChange) {
                    onCategoryChange(categoriesData);
                }
            }
        } catch (err) {
            console.error("Erro ao carregar categorias:", err);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/boards/${boardId}/categories`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newCategory),
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao criar categoria");
            }

            const createdCategory = await response.json();
            setCategories([...categories, createdCategory]);
            setNewCategory({ name: "", color: "#3B82F6" });

            if (onCategoryChange) {
                onCategoryChange([...categories, createdCategory]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCategory = async (categoryId) => {
        if (!editingData.name.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/categories/${categoryId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingData),
                }
            );

            if (response.ok) {
                const updatedCategory = await response.json();
                const updatedCategories = categories.map((cat) =>
                    cat.id === categoryId ? updatedCategory : cat
                );
                setCategories(updatedCategories);
                cancelEditing();

                if (onCategoryChange) {
                    onCategoryChange(updatedCategories);
                }
            }
        } catch (err) {
            console.error("Erro ao atualizar categoria:", err);
            setError("Falha ao atualizar a categoria.");
        }
    };

    const startEditing = (category) => {
        setEditingCategory(category.id);
        setEditingData({
            name: category.name,
            color: category.color || "#3B82F6",
        });
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setEditingData({ name: "", color: "" });
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
            return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/categories/${categoryId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const updatedCategories = categories.filter(
                    (cat) => cat.id !== categoryId
                );
                setCategories(updatedCategories);

                if (onCategoryChange) {
                    onCategoryChange(updatedCategories);
                }
            }
        } catch (err) {
            console.error("Erro ao deletar categoria:", err);
        }
    };

    return (
        <div className="category-manager">
            <h3>Gerenciar Categorias</h3>

            {/* Formulário para criar nova categoria */}
            <form onSubmit={handleCreateCategory} className="category-form">
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Nome da categoria"
                        value={newCategory.name}
                        onChange={(e) =>
                            setNewCategory({
                                ...newCategory,
                                name: e.target.value,
                            })
                        }
                        disabled={loading}
                        maxLength={255}
                    />
                    <div className="color-picker">
                        {defaultColors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`color-option ${
                                    newCategory.color === color
                                        ? "selected"
                                        : ""
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() =>
                                    setNewCategory({ ...newCategory, color })
                                }
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !newCategory.name.trim()}
                    >
                        {loading ? "Criando..." : "Adicionar"}
                    </button>
                </div>
            </form>

            {error && <p className="error-message">{error}</p>}

            {/* Lista de categorias existentes */}
            <div className="categories-list">
                {categories.map((category) => (
                    <div key={category.id} className="category-item">
                        {editingCategory === category.id ? (
                            <div className="category-edit-form">
                                <input
                                    type="text"
                                    value={editingData.name}
                                    onChange={(e) =>
                                        setEditingData({
                                            ...editingData,
                                            name: e.target.value,
                                        })
                                    }
                                    autoFocus
                                />
                                <div className="color-picker">
                                    {defaultColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`color-option ${
                                                editingData.color === color
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() =>
                                                setEditingData({
                                                    ...editingData,
                                                    color,
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                                <div className="edit-form-actions">
                                    <button
                                        onClick={() =>
                                            handleUpdateCategory(category.id)
                                        }
                                    >
                                        Salvar
                                    </button>
                                    <button onClick={cancelEditing}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="category-info">
                                    <div
                                        className="category-color"
                                        style={{
                                            backgroundColor:
                                                category.color || "#3B82F6",
                                        }}
                                    />
                                    <span className="category-name">
                                        {category.name}
                                    </span>
                                </div>
                                <div className="category-actions">
                                    <button
                                        type="button"
                                        className="edit-btn"
                                        onClick={() => startEditing(category)}
                                        title="Editar categoria"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDeleteCategory(category.id)
                                        }
                                        title="Excluir categoria"
                                    >
                                        ×
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {categories.length === 0 && (
                    <p className="no-categories">
                        Nenhuma categoria criada ainda.
                    </p>
                )}
            </div>
        </div>
    );
}
