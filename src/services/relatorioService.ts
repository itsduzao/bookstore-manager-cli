import {
  ClienteComEmprestimosAtivos,
  EmprestimosPorLivro,
  LivroDisponivel,
  LivroEmAtraso,
  LivroEmprestado,
  LivrosPorAutor,
} from "../models/relatorio";
import { RelatorioRepository } from "../repositories/relatorioRepository";

export interface RelatorioService {
  livrosDisponiveis(): Promise<LivroDisponivel[]>;
  livrosEmprestados(): Promise<LivroEmprestado[]>;
  livrosPorAutor(): Promise<LivrosPorAutor[]>;
  emprestimosPorLivro(limit?: number): Promise<EmprestimosPorLivro[]>;
  clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimosAtivos[]>;
  livrosEmAtraso(): Promise<LivroEmAtraso[]>;
}

export class DefaultRelatorioService implements RelatorioService {
  constructor(private readonly repository: RelatorioRepository) { }

  livrosDisponiveis(): Promise<LivroDisponivel[]> {
    return this.repository.livrosDisponiveis();
  }

  livrosEmprestados(): Promise<LivroEmprestado[]> {
    return this.repository.livrosEmprestados();
  }

  livrosPorAutor(): Promise<LivrosPorAutor[]> {
    return this.repository.livrosPorAutor();
  }

  emprestimosPorLivro(limit?: number): Promise<EmprestimosPorLivro[]> {
    return this.repository.emprestimosPorLivro(limit);
  }

  clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimosAtivos[]> {
    return this.repository.clientesComEmprestimosAtivos();
  }

  livrosEmAtraso(): Promise<LivroEmAtraso[]> {
    return this.repository.livrosEmAtraso();
  }
}
