import { CLIReadLine } from "./cli/IO/readline";
import { MenuLoop } from "./cli/menu-loop";
import { MenuLoopRunner } from "./cli/menu-loop.types";
import { AutorMenu, AutorMenuRunner } from "./cli/menus/autorMenu";
import { MainMenu, MainMenuRunner } from "./cli/menus/main";
import { ConsolePresenter } from "./cli/presenters/console";
import { DefaultAutorController } from "./controllers/autorController";
import { pool } from "./database/connection";
import { AutorRepository } from "./repositories/autorRepository";
import { DefaultAutorService } from "./services/autorService";

async function main(): Promise<void> {
  const io = new CLIReadLine();
  const presenter = new ConsolePresenter();
  const menuLoop: MenuLoopRunner = new MenuLoop(io, presenter);

  const autorRepository = new AutorRepository(pool);
  const autorService = new DefaultAutorService(autorRepository);
  const autorController = new DefaultAutorController(autorService, io, presenter);
  const autorMenu: AutorMenuRunner = new AutorMenu(menuLoop, autorController);

  const mainMenu: MainMenuRunner = new MainMenu(menuLoop, presenter, autorMenu);

  try {
    await mainMenu.show();
  } finally {
    io.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
