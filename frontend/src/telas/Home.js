import React, { useState, useEffect } from "react";
import "./Home.css";
import TaskBoard from "../components/tasks/TaskBoard";
import Categories from "../components/Categories";
import { LogoutButton } from "../components/buttons/LogoutButton";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

function Home({ profileId, logout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  // Carrega os quadros do usuário
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/boards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch boards");

        const data = await response.json();
        setBoards(data);

        // Seleciona o primeiro quadro por padrão se existir
        // if (data.length > 0 && !selectedBoardId) {
        //   setSelectedBoardId(data[0].id);
        // }
      } catch (error) {
        console.error("Error fetching boards:", error);
        setBoards([]);
      }
    };

    fetchBoards();
  }, [selectedBoardId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Cria um novo quadro
  const handleCreateBoard = async (boardName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: boardName }),
      });

      if (!response.ok) throw new Error("Failed to create board");

      const newBoard = await response.json();

      // Atualiza a lista de quadros e seleciona o novo quadro
      setBoards([...boards, newBoard]);
      setSelectedBoardId(newBoard.id);
      setActiveTab("tasks");
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
    }
  };

  // Renderiza o conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return selectedBoardId ? (
          <TaskBoard boardId={selectedBoardId} />
        ) : (
          <div className="empty-state">
            <p>No board selected or no boards available</p>
            <button onClick={() => setActiveTab("home")}>Create a new board</button>
          </div>
        );
      case "categories":
        return <Categories />;
      case "home":
        return (
          <div className="home-content">
            <h2>Welcome to TaskFlow</h2>
            <p>Select a board or create a new one to get started</p>
            {boards.length === 0 && (
              <div className="empty-boards">
                <p>You don't have any boards yet</p>
              </div>
            )}
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="App-body">
      <header className="App-header">
        <span style={{ display: "flex", alignItems: "center" }}>
          <div className="header-circle"></div>
          <div className="taskflow-title">TASKFLOW</div>
        </span>
        <LogoutButton onClick={handleLogout} />
      </header>

      <div className="content-wrapper">
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedBoardId={selectedBoardId}
          setSelectedBoardId={setSelectedBoardId}
          onCreateBoard={handleCreateBoard}
          boards={boards}
        />
        <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>{renderContent()}</main>
      </div>
    </div>
  );
}

export default Home;
