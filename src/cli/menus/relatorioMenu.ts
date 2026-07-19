import { RelatorioController } from "../../controllers/relatorioController";
import { MenuLoopRunner } from "../menu-loop.types";
import { MenuRunner } from "./types";

export interface RelatorioMenuRunner extends MenuRunner { }

export class RelatorioMenu implements RelatorioMenuRunner {
  constructor(
    private readonly menuLoop: MenuLoopRunner,
    private readonly controller: RelatorioController
  ) { }

  async show(): Promise<void> {
    await this.menuLoop.run({
      title: "Relatórios",
      exitKey: "0",
      options: [
        { key: "1", label: "Livros disponíveis" },
        { key: "2", label: "Livros emprestados" },
        { key: "3", label: "Livros cadastrados por autor" },
        { key: "4", label: "Quantidade de empréstimos por livro" },
        { key: "5", label: "Clientes com empréstimos ativos" },
        { key: "6", label: "Livros em atraso" },
        { key: "0", label: "Voltar" },
      ],
      actions: [
        { key: "1", handler: () => this.controller.livrosDisponiveis() },
        { key: "2", handler: () => this.controller.livrosEmprestados() },
        { key: "3", handler: () => this.controller.livrosPorAutor() },
        { key: "4", handler: () => this.controller.emprestimosPorLivro() },
        { key: "5", handler: () => this.controller.clientesComEmprestimosAtivos() },
        { key: "6", handler: () => this.controller.livrosEmAtraso() },
      ],
    });
  }
}
