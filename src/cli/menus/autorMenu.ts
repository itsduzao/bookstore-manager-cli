
import { AutorController } from "../../controllers/autorController";
import { MenuLoopRunner } from "../menu-loop.types";
import { MenuRunner } from "./types";

export interface AutorMenuRunner extends MenuRunner { }

export class AutorMenu implements AutorMenuRunner {
  constructor(
    private readonly menuLoop: MenuLoopRunner,
    private readonly controller: AutorController
  ) { }

  async show(): Promise<void> {
    await this.menuLoop.run({
      title: "Gerenciar autores",
      exitKey: "0",
      options: [
        { key: "1", label: "Listar autores" },
        { key: "2", label: "Cadastrar autor" },
        { key: "3", label: "Atualizar autor" },
        { key: "4", label: "Remover autor" },
        { key: "5", label: "Buscar autor por id" },
        { key: "6", label: "Buscar autor por nome" },
        { key: "7", label: "Buscar autor por dados" },
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
