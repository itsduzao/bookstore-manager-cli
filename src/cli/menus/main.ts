import { MenuLoopRunner } from "../menu-loop.types";
import { UiPresenter } from "../presenters/types";
import { AutorMenuRunner } from "./autorMenu";
import { BookMenuRunner } from "./bookMenu";
import { MenuRunner } from "./types";

export interface MainMenuRunner extends MenuRunner { }

export class MainMenu implements MainMenuRunner {
  constructor(
    private readonly menuLoop: MenuLoopRunner,
    private readonly presenter: UiPresenter,
    private readonly autorMenu: AutorMenuRunner,
    private readonly bookMenu: BookMenuRunner
  ) { }

  async show(): Promise<void> {
    await this.menuLoop.run({
      title: "Sistema de Biblioteca",
      exitKey: "0",
      options: [
        { key: "1", label: "Gerenciar autores" },
        { key: "2", label: "Gerenciar livros" },
        { key: "3", label: "Gerenciar empréstimos" },
        { key: "4", label: "Gerenciar clientes" },
        { key: "5", label: "Relatórios" },
        { key: "0", label: "Sair" },
      ],
      actions: [
        {
          key: "1",
          handler: () => this.autorMenu.show(),
        },
        {
          key: "2",
          handler: () => this.bookMenu.show(),
        },
        {
          key: "3",
          handler: async () => {
            this.presenter.showInfo("Menu de empréstimos ainda não implementado.");
          },
        },
        {
          key: "4",
          handler: async () => {
            this.presenter.showInfo("Menu de clientes ainda não implementado.");
          },
        },
        {
          key: "5",
          handler: async () => {
            this.presenter.showInfo("Menu de relatórios ainda não implementado.");
          },
        },
      ],
    });
  }
}
