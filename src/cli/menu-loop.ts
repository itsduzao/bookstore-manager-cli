import { CliIO } from "./IO/types";
import { UiPresenter } from "./presenters/types";
import { MenuOption } from "./types";

export type MenuAction = {
  key: string;
  handler: () => Promise<void> | void;
};

export type MenuDefinition = {
  title: string;
  options: MenuOption[];
  actions: MenuAction[];
};

export class MenuLoop {
  constructor(
    private readonly io: CliIO,
    private readonly presenter: UiPresenter
  ) { }

  async run(definition: MenuDefinition): Promise<void> {
    let running = true;

    while (running) {
      this.presenter.showMenu(definition.title, definition.options);

      const choice = await this.io.askWithOptions(
        "Escolha uma opção: ",
        definition.options.map(option => option.key)
      );

      const action = definition.actions.find(item => item.key === choice);

      if (!action) {
        this.presenter.showError("Opção inválida.");
        continue;
      }

      if (choice === "0") {
        running = false;
        continue;
      }

      await action.handler();
    }
  }
}