import { ClienteController } from "../../controllers/clienteController";
import { MenuLoopRunner } from "../menu-loop.types";
import { MenuRunner } from "./types";

export interface ClienteMenuRunner extends MenuRunner { }

export class ClienteMenu implements ClienteMenuRunner {
  constructor(
    private readonly menuLoop: MenuLoopRunner,
    private readonly controller: ClienteController
  ) { }

  async show(): Promise<void> {
    await this.menuLoop.run({
      title: "Gerenciar clientes",
      exitKey: "0",
      options: [
        { key: "1", label: "Listar clientes" },
        { key: "2", label: "Cadastrar cliente" },
        { key: "3", label: "Atualizar cliente" },
        { key: "4", label: "Remover cliente" },
        { key: "5", label: "Buscar cliente por id" },
        { key: "6", label: "Buscar cliente por nome" },
        { key: "7", label: "Buscar cliente por dados" },
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
