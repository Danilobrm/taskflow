import React, { useState } from "react";
import "./Home.css"; // Reutiliza o CSS global para o cabeçalho
import TaskBoard from "../components/tasks/TaskBoard";
import Categories from "../components/Categories";
import { LogoutButton } from "../components/buttons/LogoutButton";
import { useNavigate } from "react-router-dom";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return <TaskBoard />;
      case "categories":
        return <Categories />;
      default:
        return <TaskBoard />;
    }
  };

  return (
    <div className="App-body">
      <header className="App-header">
        <span style={{ display: "flex", alignItems: "center" }}>
          <div className="header-circle"></div>
          <div className="taskflow-title">TASKFLOW</div>
        </span>

        <LogoutButton onClick={() => navigate("/login")} />
      </header>

      <main className="App-content">
        {" "}
        <aside className={`App-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <span>&times;</span> : <span>&#9776;</span>}
          </button>
          <nav>
            <ul>
              <li
                className={`sidebar-item ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => setActiveTab("tasks")}
              >
                <span className="sidebar-icon">✓</span>
                <span className="sidebar-text">Tarefas</span>
              </li>
              <li
                className={`sidebar-item ${activeTab === "categories" ? "active" : ""}`}
                onClick={() => setActiveTab("categories")}
              >
                <span className="sidebar-icon">🗂</span>
                <span className="sidebar-text">Categorias</span>
              </li>
            </ul>
          </nav>
        </aside>
        {renderContent()}
      </main>
    </div>
    // <div className="content-wrapper">
    //   <aside className={`App-sidebar ${sidebarOpen ? "open" : "closed"}`}>
    //     <button className="sidebar-toggle" onClick={toggleSidebar}>
    //       {sidebarOpen ? <span>&times;</span> : <span>&#9776;</span>}
    //     </button>
    //     <nav>
    //       <ul>
    //         <li
    //           className={`sidebar-item ${activeTab === "tasks" ? "active" : ""}`}
    //           onClick={() => setActiveTab("tasks")}
    //         >
    //           <span className="sidebar-icon">✓</span>
    //           <span className="sidebar-text">Tarefas</span>
    //         </li>
    //         <li
    //           className={`sidebar-item ${activeTab === "categories" ? "active" : ""}`}
    //           onClick={() => setActiveTab("categories")}
    //         >
    //           <span className="sidebar-icon">🗂</span>
    //           <span className="sidebar-text">Categorias</span>
    //         </li>
    //       </ul>
    //     </nav>
    //   </aside>
    //   <div className="left-panel">
    //     <h1>Bem-vindo à sua Agenda!</h1>
    //     <p>Aqui você poderá gerenciar suas tarefas.</p>
    //   </div>
    //   <div className="right-panel">
    //     {/* Conteúdo da agenda virá aqui */}
    //     <p>Sua agenda está vazia no momento. Adicione novas tarefas!</p>
    //   </div>
    // </div>
  );
}

export default Home;
