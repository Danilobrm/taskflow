import React, { useState, useEffect } from "react";
import "./UserManager.css";

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3001/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao carregar usuários");
            }

            const usersData = await response.json();
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setEditMode(false);
        setUserData({ name: "", email: "" });
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditMode(true);
        setUserData({
            name: user.name,
            email: user.email,
        });
        setShowUserModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userData.name.trim() || !userData.email.trim()) {
            setError("Nome e email são obrigatórios");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const url = editMode
                ? `http://localhost:3001/api/users/${selectedUser.id}`
                : "http://localhost:3001/api/users";

            const response = await fetch(url, {
                method: editMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao salvar usuário");
            }

            const savedUser = await response.json();

            if (editMode) {
                setUsers(
                    users.map((user) =>
                        user.id === selectedUser.id ? savedUser : user
                    )
                );
            } else {
                setUsers([...users, savedUser]);
            }

            setShowUserModal(false);
            setUserData({ name: "", email: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (
            !window.confirm(
                `Tem certeza que deseja excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`
            )
        ) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/users/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao deletar usuário");
            }

            setUsers(users.filter((user) => user.id !== userId));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
        setEditMode(false);
        setUserData({ name: "", email: "" });
        setError(null);
    };

    if (loading && users.length === 0) {
        return (
            <div className="user-manager">
                <div className="loading">Carregando usuários...</div>
            </div>
        );
    }

    return (
        <div className="user-manager">
            <div className="user-manager-header">
                <h2>Gerenciamento de Usuários</h2>
                <button
                    type="button"
                    className="create-btn"
                    onClick={handleCreateUser}
                    disabled={loading}
                >
                    + Novo Usuário
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="users-list">
                {users.length === 0 ? (
                    <p className="no-users">Nenhum usuário encontrado</p>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                                <small>
                                    Criado em:{" "}
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString("pt-BR")}
                                </small>
                            </div>
                            <div className="user-actions">
                                <button
                                    type="button"
                                    className="edit-btn"
                                    onClick={() => handleEditUser(user)}
                                    disabled={loading}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDeleteUser(user.id, user.name)
                                    }
                                    disabled={loading}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showUserModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>
                                {editMode ? "Editar Usuário" : "Novo Usuário"}
                            </h3>
                            <button
                                type="button"
                                className="close-btn"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-group">
                                <label>Nome*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nome do usuário"
                                    required
                                    disabled={loading}
                                    maxLength={255}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    placeholder="email@exemplo.com"
                                    required
                                    disabled={loading}
                                    maxLength={255}
                                />
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={
                                        loading ||
                                        !userData.name.trim() ||
                                        !userData.email.trim()
                                    }
                                >
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
