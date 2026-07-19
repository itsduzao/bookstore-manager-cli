import { CliIO } from "../../cli/IO/types";
import { EmprestimoCreateDTO, EmprestimoUpdateDTO } from "../../dto/emprestimo";
import { Emprestimo } from "../../models/emprestimo";
import { EntityFormatter, EntityPrompter } from "./types";

export class EmprestimoFormatter implements EntityFormatter<Emprestimo> {
  formatSummary(emprestimo: Emprestimo): string {
    const situacao = emprestimo.dataDevolucao
      ? `devolvido em ${this.formatDate(emprestimo.dataDevolucao)}`
      : `vence em ${this.formatDate(emprestimo.dataVencimento)}`;

    return `#${emprestimo.id} - Livro #${emprestimo.livroId} | Cliente #${emprestimo.clienteId} | emprestado em ${this.formatDate(emprestimo.dataEmprestimo)} (${situacao})`;
  }

  formatDetails(emprestimo: Emprestimo): string[] {
    return [
      `ID do empréstimo: ${emprestimo.id}`,
      `Livro: #${emprestimo.livroId}`,
      `Cliente: #${emprestimo.clienteId}`,
      `Data do empréstimo: ${this.formatDate(emprestimo.dataEmprestimo)}`,
      `Data de vencimento: ${this.formatDate(emprestimo.dataVencimento)}`,
      `Data de devolução: ${emprestimo.dataDevolucao ? this.formatDate(emprestimo.dataDevolucao) : "ainda não devolvido"}`,
    ];
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("pt-BR");
  }
}

export class EmprestimoPrompter implements EntityPrompter<EmprestimoCreateDTO, EmprestimoUpdateDTO> {
  constructor(private readonly io: CliIO) { }

  async promptCreate(): Promise<EmprestimoCreateDTO> {
    const livroId = await this.io.askInt("ID do livro: ", { min: 1 });
    const clienteId = await this.io.askInt("ID do cliente: ", { min: 1 });

    return { livroId, clienteId };
  }

  async promptUpdate(): Promise<EmprestimoUpdateDTO> {
    return { dataDevolucao: new Date() };
  }
}
