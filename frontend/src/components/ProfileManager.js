import React, { useState, useEffect } from "react";
import "./ProfileManager.css";

export default function ProfileManager() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3001/api/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao carregar perfil");
            }

            const profileData = await response.json();
            setProfile(profileData);
            setProfileData({
                name: profileData.name,
                email: profileData.email,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!profileData.name.trim() || !profileData.email.trim()) {
            setError("Nome e email são obrigatórios");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3001/api/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao atualizar perfil");
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setEditMode(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            setError("Todos os campos são obrigatórios");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("A nova senha e confirmação não coincidem");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("A nova senha deve ter pelo menos 6 caracteres");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:3001/api/me/password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword: passwordData.currentPassword,
                        newPassword: passwordData.newPassword,
                    }),
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erro ao atualizar senha");
            }

            setPasswordMode(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setError(null);
            alert("Senha atualizada com sucesso!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditMode(false);
        setProfileData({
            name: profile.name,
            email: profile.email,
        });
        setError(null);
    };

    const cancelPassword = () => {
        setPasswordMode(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setError(null);
    };

    if (loading && !profile) {
        return (
            <div className="profile-manager">
                <div className="loading">Carregando perfil...</div>
            </div>
        );
    }

    return (
        <div className="profile-manager">
            <div className="profile-manager-header">
                <h2>Meu Perfil</h2>
                <p>Gerencie suas informações pessoais e senha</p>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="profile-sections">
                {/* Seção de Informações Pessoais */}
                <div className="profile-section">
                    <div className="section-header">
                        <h3>Informações Pessoais</h3>
                        {!editMode && (
                            <button
                                type="button"
                                className="edit-btn"
                                onClick={() => setEditMode(true)}
                                disabled={loading}
                            >
                                Editar
                            </button>
                        )}
                    </div>

                    {!editMode ? (
                        <div className="profile-info">
                            <div className="info-row">
                                <label>Nome:</label>
                                <span>{profile?.name}</span>
                            </div>
                            <div className="info-row">
                                <label>Email:</label>
                                <span>{profile?.email}</span>
                            </div>
                            <div className="info-row">
                                <label>Conta criada em:</label>
                                <span>
                                    {profile?.created_at
                                        ? new Date(
                                              profile.created_at
                                          ).toLocaleDateString("pt-BR")
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleUpdateProfile}
                            className="profile-form"
                        >
                            <div className="form-group">
                                <label>Nome*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    placeholder="Seu nome"
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
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    placeholder="seu@email.com"
                                    required
                                    disabled={loading}
                                    maxLength={255}
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={cancelEdit}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={
                                        loading ||
                                        !profileData.name.trim() ||
                                        !profileData.email.trim()
                                    }
                                >
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Seção de Senha */}
                <div className="profile-section">
                    <div className="section-header">
                        <h3>Alterar Senha</h3>
                        {!passwordMode && (
                            <button
                                type="button"
                                className="edit-btn"
                                onClick={() => setPasswordMode(true)}
                                disabled={loading}
                            >
                                Alterar
                            </button>
                        )}
                    </div>

                    {!passwordMode ? (
                        <div className="password-info">
                            <p>
                                Para sua segurança, altere sua senha
                                regularmente.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleUpdatePassword}
                            className="password-form"
                        >
                            <div className="form-group">
                                <label>Senha Atual*</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Digite sua senha atual"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Nova Senha*</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Digite a nova senha"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirmar Nova Senha*</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirme a nova senha"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={cancelPassword}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={
                                        loading ||
                                        !passwordData.currentPassword ||
                                        !passwordData.newPassword ||
                                        !passwordData.confirmPassword
                                    }
                                >
                                    {loading ? "Alterando..." : "Alterar Senha"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
