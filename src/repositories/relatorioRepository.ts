import type { Pool } from "pg";
import {
  ClienteComEmprestimosAtivos,
  EmprestimosPorLivro,
  LivroDisponivel,
  LivroEmAtraso,
  LivroEmprestado,
  LivrosPorAutor,
} from "../models/relatorio";
import { RELATORIO_TOP_LIVROS_LIMIT, TABLES } from "../shared/constants/database";

export interface RelatorioRepository {
  livrosDisponiveis(): Promise<LivroDisponivel[]>;
  livrosEmprestados(): Promise<LivroEmprestado[]>;
  livrosPorAutor(): Promise<LivrosPorAutor[]>;
  emprestimosPorLivro(limit?: number): Promise<EmprestimosPorLivro[]>;
  clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimosAtivos[]>;
  livrosEmAtraso(): Promise<LivroEmAtraso[]>;
}

type LivroDisponivelRow = {
  id: number;
  titulo: string;
  quantidade_disponivel: number;
  autor_nome: string;
};

type LivroEmprestadoRow = {
  livro_id: number;
  titulo: string;
  cliente_id: number;
  cliente_nome: string;
  data_emprestimo: Date;
  data_vencimento: Date;
};

type LivrosPorAutorRow = {
  autor_id: number;
  autor_nome: string;
  quantidade_livros: string;
};

type EmprestimosPorLivroRow = {
  livro_id: number;
  titulo: string;
  quantidade_emprestimos: string;
};

type ClienteComEmprestimosAtivosRow = {
  cliente_id: number;
  nome: string;
  email: string;
  quantidade_emprestimos_ativos: string;
};

type LivroEmAtrasoRow = {
  livro_id: number;
  titulo: string;
  cliente_id: number;
  cliente_nome: string;
  data_vencimento: Date;
  dias_em_atraso: string;
};

export class DefaultRelatorioRepository implements RelatorioRepository {
  constructor(private readonly pool: Pool) { }

  async livrosDisponiveis(): Promise<LivroDisponivel[]> {
    const query = `
      SELECT l.id, l.titulo, l.quantidade_disponivel, a.nome AS autor_nome
      FROM ${TABLES.LIVROS} l
      INNER JOIN ${TABLES.AUTORES} a ON a.id = l.autor_id
      WHERE l.quantidade_disponivel > 0
      ORDER BY l.titulo ASC
    `;

    const result = await this.pool.query<LivroDisponivelRow>(query);

    return result.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      quantidadeDisponivel: row.quantidade_disponivel,
      autorNome: row.autor_nome,
    }));
  }

  async livrosEmprestados(): Promise<LivroEmprestado[]> {
    const query = `
      SELECT
        l.id AS livro_id,
        l.titulo,
        c.id AS cliente_id,
        c.nome AS cliente_nome,
        e.data_emprestimo,
        e.data_vencimento
      FROM ${TABLES.EMPRESTIMOS} e
      INNER JOIN ${TABLES.LIVROS} l ON l.id = e.livro_id
      INNER JOIN ${TABLES.CLIENTES} c ON c.id = e.cliente_id
      WHERE e.data_devolucao IS NULL
      ORDER BY e.data_vencimento ASC
    `;

    const result = await this.pool.query<LivroEmprestadoRow>(query);

    return result.rows.map(row => ({
      livroId: row.livro_id,
      titulo: row.titulo,
      clienteId: row.cliente_id,
      clienteNome: row.cliente_nome,
      dataEmprestimo: row.data_emprestimo,
      dataVencimento: row.data_vencimento,
    }));
  }

  async livrosPorAutor(): Promise<LivrosPorAutor[]> {
    const query = `
      SELECT a.id AS autor_id, a.nome AS autor_nome, COUNT(l.id) AS quantidade_livros
      FROM ${TABLES.AUTORES} a
      LEFT JOIN ${TABLES.LIVROS} l ON l.autor_id = a.id
      GROUP BY a.id, a.nome
      ORDER BY quantidade_livros DESC, a.nome ASC
    `;

    const result = await this.pool.query<LivrosPorAutorRow>(query);

    return result.rows.map(row => ({
      autorId: row.autor_id,
      autorNome: row.autor_nome,
      quantidadeLivros: Number(row.quantidade_livros),
    }));
  }

  async emprestimosPorLivro(limit: number = RELATORIO_TOP_LIVROS_LIMIT): Promise<EmprestimosPorLivro[]> {
    const query = `
      SELECT l.id AS livro_id, l.titulo, COUNT(e.id) AS quantidade_emprestimos
      FROM ${TABLES.LIVROS} l
      LEFT JOIN ${TABLES.EMPRESTIMOS} e ON e.livro_id = l.id
      GROUP BY l.id, l.titulo
      ORDER BY quantidade_emprestimos DESC, l.titulo ASC
      LIMIT $1
    `;

    const result = await this.pool.query<EmprestimosPorLivroRow>(query, [limit]);

    return result.rows.map(row => ({
      livroId: row.livro_id,
      titulo: row.titulo,
      quantidadeEmprestimos: Number(row.quantidade_emprestimos),
    }));
  }

  async clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimosAtivos[]> {
    const query = `
      SELECT c.id AS cliente_id, c.nome, c.email, COUNT(e.id) AS quantidade_emprestimos_ativos
      FROM ${TABLES.CLIENTES} c
      INNER JOIN ${TABLES.EMPRESTIMOS} e ON e.cliente_id = c.id AND e.data_devolucao IS NULL
      GROUP BY c.id, c.nome, c.email
      ORDER BY quantidade_emprestimos_ativos DESC, c.nome ASC
    `;

    const result = await this.pool.query<ClienteComEmprestimosAtivosRow>(query);

    return result.rows.map(row => ({
      clienteId: row.cliente_id,
      nome: row.nome,
      email: row.email,
      quantidadeEmprestimosAtivos: Number(row.quantidade_emprestimos_ativos),
    }));
  }

  async livrosEmAtraso(): Promise<LivroEmAtraso[]> {
    const query = `
      SELECT
        l.id AS livro_id,
        l.titulo,
        c.id AS cliente_id,
        c.nome AS cliente_nome,
        e.data_vencimento,
        (CURRENT_DATE - e.data_vencimento) AS dias_em_atraso
      FROM ${TABLES.EMPRESTIMOS} e
      INNER JOIN ${TABLES.LIVROS} l ON l.id = e.livro_id
      INNER JOIN ${TABLES.CLIENTES} c ON c.id = e.cliente_id
      WHERE e.data_devolucao IS NULL AND e.data_vencimento < CURRENT_DATE
      ORDER BY dias_em_atraso DESC
    `;

    const result = await this.pool.query<LivroEmAtrasoRow>(query);

    return result.rows.map(row => ({
      livroId: row.livro_id,
      titulo: row.titulo,
      clienteId: row.cliente_id,
      clienteNome: row.cliente_nome,
      dataVencimento: row.data_vencimento,
      diasEmAtraso: Number(row.dias_em_atraso),
    }));
  }
}
