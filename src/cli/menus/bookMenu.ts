import { BookController } from "../../controllers/bookController";
import { MenuLoopRunner } from "../menu-loop.types";
import { MenuRunner } from "./types";

export interface BookMenuRunner extends MenuRunner { }

export class BookMenu implements BookMenuRunner {
  constructor(
    private readonly menuLoop: MenuLoopRunner,
    private readonly controller: BookController
  ) { }

  async show(): Promise<void> {
    await this.menuLoop.run({
      title: "Gerenciar livros",
      exitKey: "0",
      options: [
        { key: "1", label: "Listar livros" },
        { key: "2", label: "Cadastrar livro" },
        { key: "3", label: "Atualizar livro" },
        { key: "4", label: "Remover livro" },
        { key: "5", label: "Buscar livro por id" },
        { key: "6", label: "Buscar livro por nome" },
        { key: "7", label: "Buscar livro por dados" },
        { key: "0", label: "Voltar" },
      ],
      actions: [
        { key: "1", handler: () => this.controller.list() },
        { key: "2", handler: () => this.controller.create() },
        { key: "3", handler: () => this.controller.update() },
        { key: "4", handler: () => this.controller.delete() },
        { key: "5", handler: () => this.controller.findById() },
        { key: "6", handler: () => this.controller.findByName() },
        { key: "7", handler: () => this.controller.findByData() },
      ],
    });
  }
}
