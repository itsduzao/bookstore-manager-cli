import { UiPresenter } from "../cli/presenters/types";
import {
  ClienteComEmprestimosAtivos,
  EmprestimosPorLivro,
  LivroDisponivel,
  LivroEmAtraso,
  LivroEmprestado,
  LivrosPorAutor,
} from "../models/relatorio";
import { RelatorioService } from "../services/relatorioService";
import { presentControllerError } from "./support/errorPresenter";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("pt-BR");
}

export interface RelatorioController {
  livrosDisponiveis(): Promise<void>;
  livrosEmprestados(): Promise<void>;
  livrosPorAutor(): Promise<void>;
  emprestimosPorLivro(): Promise<void>;
  clientesComEmprestimosAtivos(): Promise<void>;
  livrosEmAtraso(): Promise<void>;
}

export class DefaultRelatorioController implements RelatorioController {
  constructor(
    private readonly service: RelatorioService,
    private readonly presenter: UiPresenter
  ) { }

  async livrosDisponiveis(): Promise<void> {
    try {
      const linhas = await this.service.livrosDisponiveis();
      this.exibir(linhas, "Nenhum livro disponível no momento.", this.formatLivroDisponivel);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async livrosEmprestados(): Promise<void> {
    try {
      const linhas = await this.service.livrosEmprestados();
      this.exibir(linhas, "Nenhum livro emprestado no momento.", this.formatLivroEmprestado);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async livrosPorAutor(): Promise<void> {
    try {
      const linhas = await this.service.livrosPorAutor();
      this.exibir(linhas, "Nenhum autor cadastrado até o momento.", this.formatLivrosPorAutor);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async emprestimosPorLivro(): Promise<void> {
    try {
      const linhas = await this.service.emprestimosPorLivro();
      this.exibir(linhas, "Nenhum livro cadastrado até o momento.", this.formatEmprestimosPorLivro);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async clientesComEmprestimosAtivos(): Promise<void> {
    try {
      const linhas = await this.service.clientesComEmprestimosAtivos();
      this.exibir(linhas, "Nenhum cliente com empréstimo ativo no momento.", this.formatClienteComEmprestimosAtivos);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async livrosEmAtraso(): Promise<void> {
    try {
      const linhas = await this.service.livrosEmAtraso();
      this.exibir(linhas, "Nenhum empréstimo em atraso no momento.", this.formatLivroEmAtraso);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  private exibir<T>(linhas: T[], mensagemVazio: string, formatar: (linha: T) => string): void {
    if (linhas.length === 0) {
      this.presenter.showInfo(mensagemVazio);
      return;
    }

    this.presenter.showList(linhas.map(formatar));
    this.presenter.showSuccess(`${linhas.length} registro(s) no relatório.`);
  }

  private formatLivroDisponivel(livro: LivroDisponivel): string {
    return `"${livro.titulo}" (${livro.autorNome}) — ${livro.quantidadeDisponivel} unidade(s) disponível(is)`;
  }

  private formatLivroEmprestado(item: LivroEmprestado): string {
    return `"${item.titulo}" com ${item.clienteNome} — emprestado em ${formatDate(item.dataEmprestimo)}, vence em ${formatDate(item.dataVencimento)}`;
  }

  private formatLivrosPorAutor(item: LivrosPorAutor): string {
    return `${item.autorNome} — ${item.quantidadeLivros} livro(s) cadastrado(s)`;
  }

  private formatEmprestimosPorLivro(item: EmprestimosPorLivro): string {
    return `"${item.titulo}" — ${item.quantidadeEmprestimos} empréstimo(s)`;
  }

  private formatClienteComEmprestimosAtivos(item: ClienteComEmprestimosAtivos): string {
    return `${item.nome} (${item.email}) — ${item.quantidadeEmprestimosAtivos} empréstimo(s) ativo(s)`;
  }

  private formatLivroEmAtraso(item: LivroEmAtraso): string {
    return `"${item.titulo}" com ${item.clienteNome} — venceu em ${formatDate(item.dataVencimento)} (${item.diasEmAtraso} dia(s) de atraso)`;
  }
}
