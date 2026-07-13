import { CliIO } from "./IO/types";
import { MenuDefinition, MenuLoopRunner } from "./menu-loop.types";
import { UiPresenter } from "./presenters/types";

export class MenuLoop implements MenuLoopRunner {
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