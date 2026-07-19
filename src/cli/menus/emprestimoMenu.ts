import { EmprestimoController } from "../../controllers/emprestimoController";
import { MenuLoopRunner } from "../menu-loop.types";
import { MenuRunner } from "./types";

export interface EmprestimoMenuRunner extends MenuRunner { }

export class EmprestimoMenu implements EmprestimoMenuRunner {
  constructor(
    private readonly menuLoop: MenuLoopRunner,
    private readonly controller: EmprestimoController
  ) { }

  async show(): Promise<void> {
    await this.menuLoop.run({
      title: "Gerenciar empréstimos",
      exitKey: "0",
      options: [
        { key: "1", label: "Listar empréstimos" },
        { key: "2", label: "Emprestar livro" },
        { key: "3", label: "Devolver livro" },
        { key: "4", label: "Remover empréstimo" },
        { key: "5", label: "Buscar empréstimo por id" },
        { key: "6", label: "Buscar empréstimos por cliente" },
        { key: "7", label: "Buscar empréstimos por livro" },
        { key: "0", label: "Voltar" },
      ],
      actions: [
        { key: "1", handler: () => this.controller.list() },
        // "Emprestar livro" -> create(): verificações de existência/disponibilidade ficam no service.
        { key: "2", handler: () => this.controller.create() },
        // "Devolver livro" -> update(): só é aceito para registrar a devolução.
        { key: "3", handler: () => this.controller.update() },
        { key: "4", handler: () => this.controller.delete() },
        { key: "5", handler: () => this.controller.findById() },
        { key: "6", handler: () => this.controller.findByCliente() },
        { key: "7", handler: () => this.controller.findByLivro() },
      ],
    });
  }
}
