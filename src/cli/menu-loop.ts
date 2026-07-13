import { CliIO } from "./IO/types";
import { MenuDefinition, MenuLoopRunner } from "./menu-loop.types";
import { UiPresenter } from "./presenters/types";

export class MenuLoop implements MenuLoopRunner {
  constructor(
    private readonly io: CliIO,
    private readonly presenter: UiPresenter
  ) { }

  async run(definition: MenuDefinition): Promise<void> {
    const exitKey = definition.exitKey ?? "0";
    let running = true;

    while (running) {
      this.presenter.showMenu(definition.title, definition.options);

      const choice = await this.io.askWithOptions(
        "Escolha uma opção: ",
        definition.options.map(option => option.key)
      );

      if (choice === exitKey) {
        running = false;
        continue;
      }

      const action = definition.actions.find(item => item.key === choice);

      if (!action) {
        this.presenter.showWarning("Opção inválida.");
        continue;
      }

      await action.handler();
    }
  }
}