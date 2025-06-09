<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CriarConta from "./telas/conta/CriarConta";
import FazerLogin from "./telas/conta/FazerLogin";
import SolicitarAlteracaoSenha from "./telas/conta/SolicitarAlteracaoSenha";
import AlterarSenha from "./telas/conta/AlterarSenha";
import Home from "./telas/Home";

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <div className="header-circle"></div>
                    <div className="taskflow-title">TASKFLOW</div>
                </header>
                <div className="routes-content">
                    <Routes>
                        <Route path="/" element={<FazerLogin />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/register" element={<CriarConta />} />
                        <Route path="/login" element={<FazerLogin />} />
                        <Route
                            path="/recuperar-senha"
                            element={<SolicitarAlteracaoSenha />}
                        />
                        <Route
                            path="/alterar-senha"
                            element={<AlterarSenha />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
=======
import { useState } from "react";
import "./App.css";
import TaskBoard from "./components/TaskBoard";
import Categories from "./components/Categories"; // You'll need to create this component
import LogoutButton from "./components/LogoutButton";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks"); // 'tasks' or 'categories'

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
    <div className="App">
      <header className="App-header">
        <span style={{ display: "flex", alignItems: "center" }}>
          <div className="header-circle"></div>
          <h1>TASKFLOW</h1>
        </span>
        <LogoutButton onClick={() => console.log("Logout clicked")} />
      </header>
      <div className="App-body">
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
        <main className="App-content">{renderContent()}</main>
      </div>
    </div>
  );
>>>>>>> 3e44f3c9fc6165f1b4106327b5090a9b1d5900e2
}

export default App;
