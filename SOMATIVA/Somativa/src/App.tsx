import React, { useState, useEffect } from 'react';
import './App.css';

// Tipos definidos diretamente no arquivo
interface Event {
  id: string;
  title: string;
  type: 'Palestra' | 'Workshop' | 'Painel';
  status: 'Agendado' | 'Em Andamento' | 'Encerrado';
  date: string;
  vagas: number;
  vagasIniciais: number;
}

type FilterStatus = 'Todos' | 'Agendados' | 'Em Andamento' | 'Encerrados';

function App() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState<Event['type']>("Palestra");
  const [eventVagas, setEventVagas] = useState<number>(30);
  const [eventList, setEventList] = useState<Event[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showChangesModal, setShowChangesModal] = useState(false);

  // Carregar dados iniciais do LocalStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("@eventpulse_data");
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        setEventList(parsed);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    }
  }, []);

  // Sincronizar alterações com o LocalStorage
  useEffect(() => {
    localStorage.setItem("@eventpulse_data", JSON.stringify(eventList));
  }, [eventList]);

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEvent: Event = {
      id: crypto.randomUUID(),
      title: eventTitle,
      type: eventType,
      status: "Agendado",
      date: new Date().toLocaleDateString('pt-BR'),
      vagas: eventVagas,
      vagasIniciais: eventVagas
    };

    setEventList([newEvent, ...eventList]);
    setEventTitle("");
  };

  const toggleStatus = (id: string) => {
    setEventList(eventList.map(evt => {
      if (evt.id === id) {
        const nextStatus = evt.status === "Agendado" ? "Em Andamento" :
          evt.status === "Em Andamento" ? "Encerrado" : "Agendado";
        return { ...evt, status: nextStatus };
      }
      return evt;
    }));
  };

  const deleteEvent = (id: string) => {
    setEventList(eventList.filter(evt => evt.id !== id));
  };

  const subscribeStudent = (id: string) => {
    setEventList(eventList.map(evt => {
      if (evt.id === id && evt.vagas > 0) {
        return { ...evt, vagas: evt.vagas - 1 };
      }
      return evt;
    }));
  };

  const clearAllEvents = () => {
    const userConfirmed = window.confirm(
      "⚠️ ATENÇÃO: Esta ação irá apagar TODO o cronograma de eventos.\n\n" +
      "Todos os dados serão permanentemente removidos.\n\n" +
      "Tem certeza que deseja continuar?"
    );
    
    if (userConfirmed) {
      setEventList([]);
      localStorage.removeItem("@eventpulse_data");
      alert("✅ Cronograma limpo com sucesso!");
    }
  };

  // Aplicar filtros e ordenação
  const getFilteredAndSortedEvents = () => {
    let filtered = [...eventList];

    // Filtro por status
    if (filter !== "Todos") {
      const statusMap = {
        "Agendados": "Agendado",
        "Em Andamento": "Em Andamento",
        "Encerrados": "Encerrado"
      };
      filtered = filtered.filter(evt => evt.status === statusMap[filter]);
    }

    // Filtro por pesquisa
    if (searchTerm.trim()) {
      filtered = filtered.filter(evt =>
        evt.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenação: Workshops no início
    filtered.sort((a, b) => {
      if (a.type === "Workshop" && b.type !== "Workshop") return -1;
      if (a.type !== "Workshop" && b.type === "Workshop") return 1;
      return 0;
    });

    return filtered;
  };

  const filteredEvents = getFilteredAndSortedEvents();

  // Estatísticas para o modal
  const stats = {
    totalEvents: eventList.length,
    workshops: eventList.filter(e => e.type === "Workshop").length,
    palestras: eventList.filter(e => e.type === "Palestra").length,
    paineis: eventList.filter(e => e.type === "Painel").length,
    emAndamento: eventList.filter(e => e.status === "Em Andamento").length,
    encerrados: eventList.filter(e => e.status === "Encerrado").length
  };

  return (
    <div className="app-container">
      <header>
        <h1>🎓 EventPulse</h1>
        <p>Gestão de Eventos Acadêmicos</p>
        <button onClick={clearAllEvents} className="clear-all-btn">
          🗑️ Limpar Cronograma
        </button>
      </header>

      <section className="form-section">
        <form onSubmit={addEvent}>
          <input
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Nome do evento ou atividade..."
            className="event-input"
          />
          <select 
            value={eventType} 
            onChange={(e) => setEventType(e.target.value as Event['type'])}
            className="type-select"
          >
            <option value="Palestra">📚 Palestra</option>
            <option value="Workshop">🛠️ Workshop</option>
            <option value="Painel">🎯 Painel</option>
          </select>
          <select 
            value={eventVagas} 
            onChange={(e) => setEventVagas(Number(e.target.value))}
            className="vagas-select"
          >
            <option value={10}>10 vagas</option>
            <option value={30}>30 vagas</option>
            <option value={50}>50 vagas</option>
          </select>
          <button type="submit">➕ Agendar Evento</button>
        </form>
      </section>

      <section className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Pesquisar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          {["Todos", "Agendados", "Em Andamento", "Encerrados"].map(f => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f as FilterStatus)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <main className="event-grid">
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p>📭 Nenhum evento encontrado</p>
            <small>Adicione seu primeiro evento acima!</small>
          </div>
        ) : (
          filteredEvents.map(item => (
            <div
              key={item.id}
              className={`event-card ${item.type.toLowerCase()} ${item.status.toLowerCase().replace(" ", "-")}`}
            >
              <div className="event-content">
                <h3>
                  {item.type === "Workshop" && "🔧 "}
                  {item.type === "Palestra" && "📖 "}
                  {item.type === "Painel" && "🎯 "}
                  {item.title}
                </h3>
                <span className="event-tag">📌 Tipo: {item.type}</span>
                <span className={`status-badge status-${item.status.toLowerCase().replace(" ", "-")}`}>
                  📍 Status: {item.status}
                </span>
                <span className="vagas-info">
                  🎟️ Vagas: {item.vagas} / {item.vagasIniciais}
                </span>
                <small>📅 Registrado em: {item.date}</small>
              </div>
              <div className="event-actions">
                <button 
                  onClick={() => toggleStatus(item.id)} 
                  className="status-btn"
                >
                  {item.status === "Agendado" ? "▶️ Iniciar" : 
                   item.status === "Em Andamento" ? "🏁 Encerrar" : "🔄 Reiniciar"}
                </button>
                <button 
                  onClick={() => subscribeStudent(item.id)} 
                  className={`subscribe-btn ${item.vagas === 0 ? 'disabled' : ''}`}
                  disabled={item.vagas === 0}
                >
                  {item.vagas === 0 ? "❌ Esgotado" : "🎓 Inscrever Aluno"}
                </button>
                <button onClick={() => deleteEvent(item.id)} className="delete-btn">
                  🗑️ Remover
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Botão Flutuante com Favicon */}
      <button 
        className="floating-favicon" 
        onClick={() => setShowChangesModal(true)}
        aria-label="Ver alterações realizadas"
      >
        🎨
      </button>

      {/* Modal de Alterações */}
      {showChangesModal && (
        <div className="modal-overlay" onClick={() => setShowChangesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎨 Alterações Realizadas</h2>
              <button className="modal-close" onClick={() => setShowChangesModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <h3>Lista de Implementações:</h3>
              <ul>
                <li>✅ <strong>Destaque Cronológico de Workshops</strong> - Workshops sempre aparecem no topo da lista</li>
                <li>✅ <strong>Filtro por Caixa de Pesquisa</strong> - Busca em tempo real por título do evento</li>
                <li>✅ <strong>Sistema de Vagas</strong> - Eventos têm 10, 30 ou 50 vagas com botão de inscrição</li>
                <li>✅ <strong>Alerta Preventivo de Limpeza</strong> - Confirmação nativa antes de limpar cronograma</li>
                <li>✅ <strong>Estatísticas do Evento</strong> - Modal com dados detalhados dos eventos</li>
                <li>✅ <strong>Design Responsivo</strong> - Layout adaptável para diferentes telas</li>
                <li>✅ <strong>Animações e Transições</strong> - Feedback visual para ações do usuário</li>
                <li>✅ <strong>TypeScript Completo</strong> - Tipagem forte em toda aplicação</li>
              </ul>
              
              <div className="stats-section">
                <h3>📊 Estatísticas Atuais:</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{stats.totalEvents}</span>
                    <span className="stat-label">Total Eventos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.workshops}</span>
                    <span className="stat-label">Workshops</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.palestras}</span>
                    <span className="stat-label">Palestras</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.paineis}</span>
                    <span className="stat-label">Painéis</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.emAndamento}</span>
                    <span className="stat-label">Em Andamento</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.encerrados}</span>
                    <span className="stat-label">Encerrados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;