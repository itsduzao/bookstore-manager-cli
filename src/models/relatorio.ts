export type LivroDisponivel = {
  id: number;
  titulo: string;
  quantidadeDisponivel: number;
  autorNome: string;
};

export type LivroEmprestado = {
  livroId: number;
  titulo: string;
  clienteId: number;
  clienteNome: string;
  dataEmprestimo: Date;
  dataVencimento: Date;
};

export type LivrosPorAutor = {
  autorId: number;
  autorNome: string;
  quantidadeLivros: number;
};

export type EmprestimosPorLivro = {
  livroId: number;
  titulo: string;
  quantidadeEmprestimos: number;
};

export type ClienteComEmprestimosAtivos = {
  clienteId: number;
  nome: string;
  email: string;
  quantidadeEmprestimosAtivos: number;
};

export type LivroEmAtraso = {
  livroId: number;
  titulo: string;
  clienteId: number;
  clienteNome: string;
  dataVencimento: Date;
  diasEmAtraso: number;
};
