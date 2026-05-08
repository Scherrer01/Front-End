import React, { useState, useEffect } from 'react';
import './App.css';
import { Event, Aluno, FilterStatus, EstatisticasEvento } from './types';

function App() {
  // Estados principais
  const [eventList, setEventList] = useState<Event[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showAlunoModal, setShowAlunoModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [quantidadeAlunos, setQuantidadeAlunos] = useState(1);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    title: '',
    type: 'Palestra' as Event['type'],
    date: '',
    horario: '14:00',
    local: '',
    vagas: 30,
    descricao: '',
    palestrante: '',
    cargaHoraria: 2
  });

  // Estado do formulário de aluno
  const [alunoData, setAlunoData] = useState({
    nome: '',
    email: '',
    matricula: ''
  });

  // Carregar dados do LocalStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("@eventpulse_data_v2");
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        setEventList(parsed);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    }
  }, []);

  // Salvar no LocalStorage
  useEffect(() => {
    localStorage.setItem("@eventpulse_data_v2", JSON.stringify(eventList));
  }, [eventList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addOrUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.date || !formData.local) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (editingEvent) {
      // Atualizar evento existente
      setEventList(eventList.map(evt => 
        evt.id === editingEvent.id 
          ? { 
              ...evt, 
              ...formData,
              vagas: formData.vagas,
              vagasIniciais: formData.vagas,
              alunosInscritos: evt.alunosInscritos // Manter alunos inscritos
            }
          : evt
      ));
      setEditingEvent(null);
      alert("✅ Evento atualizado com sucesso!");
    } else {
      // Criar novo evento
      const newEvent: Event = {
        id: crypto.randomUUID(),
        title: formData.title,
        type: formData.type,
        status: "Agendado",
        date: formData.date,
        horario: formData.horario,
        local: formData.local,
        vagas: formData.vagas,
        vagasIniciais: formData.vagas,
        alunosInscritos: [],
        descricao: formData.descricao,
        palestrante: formData.palestrante,
        cargaHoraria: formData.cargaHoraria
      };

      setEventList([newEvent, ...eventList]);
      alert("✅ Evento criado com sucesso!");
    }

    // Resetar formulário
    setFormData({
      title: '',
      type: 'Palestra',
      date: '',
      horario: '14:00',
      local: '',
      vagas: 30,
      descricao: '',
      palestrante: '',
      cargaHoraria: 2
    });
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      date: event.date,
      horario: event.horario,
      local: event.local,
      vagas: event.vagas,
      descricao: event.descricao || '',
      palestrante: event.palestrante || '',
      cargaHoraria: event.cargaHoraria || 2
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      type: 'Palestra',
      date: '',
      horario: '14:00',
      local: '',
      vagas: 30,
      descricao: '',
      palestrante: '',
      cargaHoraria: 2
    });
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
    if (window.confirm("⚠️ Tem certeza que deseja remover este evento?")) {
      setEventList(eventList.filter(evt => evt.id !== id));
    }
  };

  const openAlunoModal = (event: Event) => {
    setSelectedEvent(event);
    setQuantidadeAlunos(1);
    setAlunoData({ nome: '', email: '', matricula: '' });
    setShowAlunoModal(true);
  };

  const addAlunosToEvent = () => {
    if (!selectedEvent) return;

    if (!alunoData.nome || !alunoData.email || !alunoData.matricula) {
      alert("Por favor, preencha todos os dados do aluno!");
      return;
    }

    if (quantidadeAlunos < 1 || quantidadeAlunos > selectedEvent.vagas) {
      alert(`Quantidade inválida! Máximo de ${selectedEvent.vagas} vagas disponíveis.`);
      return;
    }

    const novosAlunos: Aluno[] = [];
    for (let i = 0; i < quantidadeAlunos; i++) {
      const aluno: Aluno = {
        id: crypto.randomUUID(),
        nome: i === 0 ? alunoData.nome : `${alunoData.nome} ${i + 1}`,
        email: i === 0 ? alunoData.email : `${alunoData.email.split('@')[0]}${i + 1}@${alunoData.email.split('@')[1]}`,
        matricula: i === 0 ? alunoData.matricula : `${alunoData.matricula}-${i + 1}`,
        dataInscricao: new Date().toLocaleDateString('pt-BR')
      };
      novosAlunos.push(aluno);
    }

    setEventList(eventList.map(evt =>
      evt.id === selectedEvent.id
        ? {
            ...evt,
            vagas: evt.vagas - quantidadeAlunos,
            alunosInscritos: [...evt.alunosInscritos, ...novosAlunos]
          }
        : evt
    ));

    setShowAlunoModal(false);
    setSelectedEvent(null);
    alert(`✅ ${quantidadeAlunos} aluno(s) inscrito(s) com sucesso!`);
  };

  const removeAluno = (eventId: string, alunoId: string) => {
    if (window.confirm("Deseja remover este aluno do evento?")) {
      setEventList(eventList.map(evt => {
        if (evt.id === eventId) {
          const alunoRemovido = evt.alunosInscritos.find(a => a.id === alunoId);
          return {
            ...evt,
            vagas: evt.vagas + 1,
            alunosInscritos: evt.alunosInscritos.filter(a => a.id !== alunoId)
          };
        }
        return evt;
      }));
    }
  };

  const clearAllEvents = () => {
    setEventList([]);
    localStorage.removeItem("@eventpulse_data_v2");
  };

  const getFilteredAndSortedEvents = () => {
    let filtered = [...eventList];

    if (filter !== "Todos") {
      const statusMap = {
        "Agendados": "Agendado",
        "Em Andamento": "Em Andamento",
        "Encerrados": "Encerrado"
      };
      filtered = filtered.filter(evt => evt.status === statusMap[filter]);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(evt =>
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.palestrante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.local.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (a.type === "Workshop" && b.type !== "Workshop") return -1;
      if (a.type !== "Workshop" && b.type === "Workshop") return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return filtered;
  };

  const getEstatisticas = (): EstatisticasEvento => {
    const totalVagas = eventList.reduce((sum, e) => sum + e.vagasIniciais, 0);
    const totalInscritos = eventList.reduce((sum, e) => sum + e.alunosInscritos.length, 0);
    
    const eventosPorTipo: Record<string, number> = {};
    const eventosPorStatus: Record<string, number> = {};
    
    eventList.forEach(e => {
      eventosPorTipo[e.type] = (eventosPorTipo[e.type] || 0) + 1;
      eventosPorStatus[e.status] = (eventosPorStatus[e.status] || 0) + 1;
    });

    return {
      totalEventos: eventList.length,
      totalVagas,
      totalInscritos,
      taxaOcupacao: totalVagas > 0 ? (totalInscritos / totalVagas) * 100 : 0,
      eventosPorTipo,
      eventosPorStatus
    };
  };

  const filteredEvents = getFilteredAndSortedEvents();
  const stats = getEstatisticas();

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <div>
            <h1>🎓 EventPulse Pro</h1>
            <p>Sistema Profissional de Gestão de Eventos Acadêmicos</p>
          </div>
          <div className="header-buttons">
            <button onClick={() => setShowStatsModal(true)} className="stats-btn">
              📊 Estatísticas
            </button>
            <button onClick={clearAllEvents} className="clear-all-btn">
              🗑️ Limpar Tudo
            </button>
          </div>
        </div>
      </header>

      {/* Formulário de Evento */}
      <section className="form-section">
        <div className="form-header">
          <h2>{editingEvent ? '✏️ Editar Evento' : '➕ Criar Novo Evento'}</h2>
          {editingEvent && (
            <button onClick={cancelEdit} className="cancel-btn">Cancelar Edição</button>
          )}
        </div>
        <form onSubmit={addOrUpdateEvent}>
          <div className="form-row">
            <div className="form-group">
              <label>Título do Evento *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Workshop de React Avançado"
                required
              />
            </div>
            <div className="form-group">
              <label>Tipo de Evento *</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="Palestra">📚 Palestra</option>
                <option value="Workshop">🛠️ Workshop</option>
                <option value="Painel">🎯 Painel</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data do Evento *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Horário *</label>
              <input
                type="time"
                name="horario"
                value={formData.horario}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Local *</label>
              <input
                name="local"
                value={formData.local}
                onChange={handleInputChange}
                placeholder="Ex: Auditório Principal"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Palestrante/Ministrante</label>
              <input
                name="palestrante"
                value={formData.palestrante}
                onChange={handleInputChange}
                placeholder="Nome do palestrante"
              />
            </div>
            <div className="form-group">
              <label>Número de Vagas *</label>
              <input
                type="number"
                name="vagas"
                value={formData.vagas}
                onChange={handleInputChange}
                min="1"
                max="500"
                required
              />
            </div>
            <div className="form-group">
              <label>Carga Horária (horas)</label>
              <input
                type="number"
                name="cargaHoraria"
                value={formData.cargaHoraria}
                onChange={handleInputChange}
                min="1"
                max="40"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Descrição do Evento</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={3}
                placeholder="Descreva o conteúdo, objetivos e público-alvo do evento..."
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {editingEvent ? '✏️ Atualizar Evento' : '➕ Criar Evento'}
          </button>
        </form>
      </section>

      {/* Filtros */}
      <section className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Pesquisar por título, palestrante ou local..."
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
              <span className="filter-count">
                {f === "Todos" ? eventList.length : 
                 eventList.filter(e => e.status === (f === "Agendados" ? "Agendado" : f === "Em Andamento" ? "Em Andamento" : "Encerrado")).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Lista de Eventos */}
      <main className="event-grid">
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p>📭 Nenhum evento encontrado</p>
            <small>Crie seu primeiro evento acima!</small>
          </div>
        ) : (
          filteredEvents.map(item => (
            <div
              key={item.id}
              className={`event-card ${item.type.toLowerCase()} ${item.status.toLowerCase().replace(" ", "-")}`}
            >
              <div className="event-header">
                <div className="event-type-badge">{item.type}</div>
                <div className={`status-badge status-${item.status.toLowerCase().replace(" ", "-")}`}>
                  {item.status === "Agendado" ? "📅" : item.status === "Em Andamento" ? "▶️" : "✅"} {item.status}
                </div>
              </div>

              <div className="event-content">
                <h3>{item.title}</h3>
                {item.palestrante && <p className="palestrante">👨‍🏫 {item.palestrante}</p>}
                <div className="event-details">
                  <span>📅 {new Date(item.date).toLocaleDateString('pt-BR')}</span>
                  <span>⏰ {item.horario}</span>
                  <span>📍 {item.local}</span>
                  <span>⏱️ {item.cargaHoraria}h</span>
                </div>
                {item.descricao && <p className="descricao">{item.descricao}</p>}
                <div className="vagas-info">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${((item.vagasIniciais - item.vagas) / item.vagasIniciais) * 100}%` }}
                    ></div>
                  </div>
                  <span>🎟️ Vagas: {item.vagas} / {item.vagasIniciais}</span>
                  <span>👥 Inscritos: {item.alunosInscritos.length}</span>
                </div>

                {/* Lista de Alunos Inscritos */}
                {item.alunosInscritos.length > 0 && (
                  <div className="alunos-list">
                    <details>
                      <summary>📋 Alunos Inscritos ({item.alunosInscritos.length})</summary>
                      <div className="alunos-grid">
                        {item.alunosInscritos.map(aluno => (
                          <div key={aluno.id} className="aluno-item">
                            <div>
                              <strong>{aluno.nome}</strong>
                              <small>{aluno.matricula}</small>
                              <small>{aluno.email}</small>
                            </div>
                            <button 
                              onClick={() => removeAluno(item.id, aluno.id)}
                              className="remove-aluno-btn"
                              title="Remover aluno"
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>

              <div className="event-actions">
                <button onClick={() => toggleStatus(item.id)} className="status-btn">
                  {item.status === "Agendado" ? "▶️ Iniciar" : 
                   item.status === "Em Andamento" ? "🏁 Encerrar" : "🔄 Reiniciar"}
                </button>
                <button onClick={() => openAlunoModal(item)} className="subscribe-btn" disabled={item.vagas === 0}>
                  {item.vagas === 0 ? "❌ Esgotado" : "🎓 Inscrever Aluno(s)"}
                </button>
                <button onClick={() => editEvent(item)} className="edit-btn">
                  ✏️ Editar
                </button>
                <button onClick={() => deleteEvent(item.id)} className="delete-btn">
                  🗑️ Remover
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Modal de Inscrição de Alunos */}
      {showAlunoModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowAlunoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎓 Inscrever Aluno(s)</h2>
              <button className="modal-close" onClick={() => setShowAlunoModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <h3>{selectedEvent.title}</h3>
              <p>Vagas disponíveis: <strong>{selectedEvent.vagas}</strong></p>
              
              <div className="form-group">
                <label>Quantidade de Alunos</label>
                <input
                  type="number"
                  min="1"
                  max={selectedEvent.vagas}
                  value={quantidadeAlunos}
                  onChange={(e) => setQuantidadeAlunos(Math.min(parseInt(e.target.value) || 1, selectedEvent.vagas))}
                />
              </div>

              <div className="form-group">
                <label>Nome do Aluno (Principal)</label>
                <input
                  value={alunoData.nome}
                  onChange={(e) => setAlunoData({ ...alunoData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  value={alunoData.email}
                  onChange={(e) => setAlunoData({ ...alunoData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="form-group">
                <label>Matrícula</label>
                <input
                  value={alunoData.matricula}
                  onChange={(e) => setAlunoData({ ...alunoData, matricula: e.target.value })}
                  placeholder="Número de matrícula"
                />
              </div>

              {quantidadeAlunos > 1 && (
                <div className="alert-info">
                  ℹ️ Para {quantidadeAlunos} alunos, serão gerados dados sequenciais automáticos
                </div>
              )}

              <button onClick={addAlunosToEvent} className="submit-btn">
                Inscrever {quantidadeAlunos} Aluno(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Estatísticas */}
      {showStatsModal && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 Dashboard de Estatísticas</h2>
              <button className="modal-close" onClick={() => setShowStatsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="stats-dashboard">
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.totalEventos}</span>
                      <span className="stat-label">Total de Eventos</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎟️</div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.totalVagas}</span>
                      <span className="stat-label">Vagas Oferecidas</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.totalInscritos}</span>
                      <span className="stat-label">Alunos Inscritos</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.taxaOcupacao.toFixed(1)}%</span>
                      <span className="stat-label">Taxa de Ocupação</span>
                    </div>
                  </div>
                </div>

                <div className="stats-details">
                  <div className="stats-section">
                    <h3>Eventos por Tipo</h3>
                    {Object.entries(stats.eventosPorTipo).map(([tipo, count]) => (
                      <div key={tipo} className="stat-bar">
                        <span>{tipo}</span>
                        <div className="bar">
                          <div className="bar-fill" style={{ width: `${(count / stats.totalEventos) * 100}%` }}></div>
                        </div>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="stats-section">
                    <h3>Eventos por Status</h3>
                    {Object.entries(stats.eventosPorStatus).map(([status, count]) => (
                      <div key={status} className="stat-bar">
                        <span>{status}</span>
                        <div className="bar">
                          <div className="bar-fill" style={{ width: `${(count / stats.totalEventos) * 100}%` }}></div>
                        </div>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botão Flutuante */}
      <button className="floating-favicon" onClick={() => setShowChangesModal(true)}>
        🎨
      </button>

      {/* Modal de Alterações */}
      {showChangesModal && (
        <div className="modal-overlay" onClick={() => setShowChangesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎨 Recursos Profissionais</h2>
              <button className="modal-close" onClick={() => setShowChangesModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <h3>Funcionalidades Implementadas:</h3>
              <ul>
                <li>✅ <strong>Edição de Eventos</strong> - Edite qualquer evento existente</li>
                <li>✅ <strong>Cadastro Múltiplo de Alunos</strong> - Inscreva vários alunos de uma vez</li>
                <li>✅ <strong>Escolha de Data e Horário</strong> - Defina data, horário e local do evento</li>
                <li>✅ <strong>Lista de Alunos Inscritos</strong> - Visualize e remova alunos</li>
                <li>✅ <strong>Dashboard de Estatísticas</strong> - Métricas detalhadas do sistema</li>
                <li>✅ <strong>Barra de Progresso</strong> - Visualização da ocupação de vagas</li>
                <li>✅ <strong>Pesquisa Avançada</strong> - Busca por título, palestrante ou local</li>
                <li>✅ <strong>Formulário Completo</strong> - Descrição, palestrante, carga horária</li>
                <li>✅ <strong>Ordenação por Data</strong> - Eventos organizados cronologicamente</li>
                <li>✅ <strong>Workshops em Destaque</strong> - Workshops sempre no topo</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;