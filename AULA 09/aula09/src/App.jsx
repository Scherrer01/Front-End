import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Baixa");
  const [taskList, setTaskList] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("@taskflow_data");
    if (saved) setTaskList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("@taskflow_data", JSON.stringify(taskList));
  }, [taskList]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      text: taskText,
      priority: priority,
      completed: false,
      createdAt: new Date().toLocaleDateString()
    };

    setTaskList([newTask, ...taskList]);
    setTaskText("");
  };

  const toggleTask = (id) => {
    setTaskList(taskList.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      setTaskList(taskList.filter(t => t.id !== id));
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    setTaskList(taskList.map(t =>
      t.id === id ? { ...t, text: editingText } : t
    ));
    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Aplicar filtros e busca
  const getFilteredAndSearchedTasks = () => {
    let filtered = taskList;

    // Filtrar por status
    if (filter === "Pendentes") {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === "Concluídas") {
      filtered = filtered.filter(t => t.completed);
    }

    // Filtrar por texto de busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Ordenar tarefas (Alta prioridade no topo)
  const sortTasksByPriority = (tasks) => {
    const priorityOrder = { "Alta": 1, "Média": 2, "Baixa": 3 };
    return [...tasks].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const filteredTasks = sortTasksByPriority(getFilteredAndSearchedTasks());

  return (
    <div className="app-container">
      <header>
        <h1>TaskFlow</h1>
        <p>Gestão de Produtividade</p>
      </header>

      <section className="form-section">
        <form onSubmit={addTask}>
          <input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Descrição da tarefa..."
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
          <button type="submit">Criar</button>
        </form>
      </section>

      <section className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar tarefas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      <section className="filter-section">
        {["Todas", "Pendentes", "Concluídas"].map(f => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </section>

      <main className="task-grid">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma tarefa encontrada</p>
          </div>
        ) : (
          filteredTasks.map(item => (
            <div key={item.id} className={`task-card ${item.priority.toLowerCase()} ${item.completed ? 'done' : ''}`}>
              <div className="task-content">
                {editingId === item.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, item.id)}
                      autoFocus
                      className="edit-input"
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(item.id)} className="save-btn">✓</button>
                      <button onClick={cancelEdit} className="cancel-btn">✗</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{item.text}</h3>
                    <span>Prioridade: {item.priority}</span>
                    <small>Criada em: {item.createdAt}</small>
                  </>
                )}
              </div>
              <div className="task-actions">
                <button onClick={() => toggleTask(item.id)}>
                  {item.completed ? "Reabrir" : "Concluir"}
                </button>
                {!editingId && (
                  <button onClick={() => startEditing(item)} className="edit">
                    Editar
                  </button>
                )}
                <button onClick={() => deleteTask(item.id)} className="delete">
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default App;