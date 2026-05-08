export interface Aluno {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  dataInscricao: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'Palestra' | 'Workshop' | 'Painel';
  status: 'Agendado' | 'Em Andamento' | 'Encerrado';
  date: string;
  horario: string;
  local: string;
  vagas: number;
  vagasIniciais: number;
  alunosInscritos: Aluno[];
  descricao: string;
  palestrante: string;
  cargaHoraria: number;
}

export type FilterStatus = 'Todos' | 'Agendados' | 'Em Andamento' | 'Encerrados';

export interface EstatisticasEvento {
  totalEventos: number;
  totalVagas: number;
  totalInscritos: number;
  taxaOcupacao: number;
  eventosPorTipo: Record<string, number>;
  eventosPorStatus: Record<string, number>;
}