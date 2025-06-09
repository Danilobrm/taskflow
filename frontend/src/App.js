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
}

export default App;
