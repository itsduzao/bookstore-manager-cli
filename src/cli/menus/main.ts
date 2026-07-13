import { MenuLoopRunner } from "../menu-loop.types";
import { UiPresenter } from "../presenters/types";

export interface MainMenuRunner {
  show(): Promise<void>;
}

export class MainMenu implements MainMenuRunner {
  constructor(
    private readonly menuLoop: MenuLoopRunner,
    private readonly presenter: UiPresenter
  ) { }

  async show(): Promise<void> {
    await this.menuLoop.run({
      title: "Sistema de Biblioteca",
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
          handler: async () => {
            this.presenter.showInfo("Menu de autores ainda não implementado.");
          },
        },
        {
          key: "2",
          handler: async () => {
            this.presenter.showInfo("Menu de livros ainda não implementado.");
          },
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
