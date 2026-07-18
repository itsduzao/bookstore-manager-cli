import { CLIReadLine } from "./cli/IO/readline";
import { MenuLoop } from "./cli/menu-loop";
import { MenuLoopRunner } from "./cli/menu-loop.types";
import { AutorMenu, AutorMenuRunner } from "./cli/menus/autorMenu";
import { BookMenu, BookMenuRunner } from "./cli/menus/bookMenu";
import { ClienteMenu, ClienteMenuRunner } from "./cli/menus/clienteMenu";
import { MainMenu, MainMenuRunner } from "./cli/menus/main";
import { ConsolePresenter } from "./cli/presenters/console";
import { DefaultAutorController } from "./controllers/autorController";
import { DefaultBookController } from "./controllers/bookController";
import { DefaultClienteController } from "./controllers/clienteController";
import { pool } from "./database/connection";
import { DefaultAutorRepository } from "./repositories/autorRepository";
import { DefaultBookRepository } from "./repositories/bookRepository";
import { DefaultClienteRepository } from "./repositories/clienteRepository";
import { DefaultAutorService } from "./services/autorService";
import { DefaultBookService } from "./services/bookService";
import { DefaultClienteService } from "./services/clienteService";

async function main(): Promise<void> {
  const io = new CLIReadLine();
  const presenter = new ConsolePresenter();
  const menuLoop: MenuLoopRunner = new MenuLoop(io, presenter);

  const autorRepository = new DefaultAutorRepository(pool);
  const autorService = new DefaultAutorService(autorRepository);
  const autorController = new DefaultAutorController(autorService, io, presenter);
  const autorMenu: AutorMenuRunner = new AutorMenu(menuLoop, autorController);

  const bookRepository = new DefaultBookRepository(pool);
  const bookService = new DefaultBookService(bookRepository, autorService);
  const bookController = new DefaultBookController(bookService, io, presenter);
  const bookMenu: BookMenuRunner = new BookMenu(menuLoop, bookController);

  const clienteRepository = new DefaultClienteRepository(pool);
  const clienteService = new DefaultClienteService(clienteRepository);
  const clienteController = new DefaultClienteController(clienteService, io, presenter);
  const clienteMenu: ClienteMenuRunner = new ClienteMenu(menuLoop, clienteController);

  const mainMenu: MainMenuRunner = new MainMenu(menuLoop, presenter, autorMenu, bookMenu, clienteMenu);

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
