import { CLIReadLine } from "./cli/IO/readline";
import { MenuLoop } from "./cli/menu-loop";
import { MenuLoopRunner } from "./cli/menu-loop.types";
import { MainMenu, MainMenuRunner } from "./cli/menus/main";
import { ConsolePresenter } from "./cli/presenters/console";
import { pool } from "./database/connection";
import { createAutorFeature } from "./factories/autorFactory";
import { createClienteFeature } from "./factories/clienteFactory";
import { createEmprestimoFeature } from "./factories/emprestimoFactory";
import { createLivroFeature } from "./factories/livroFactory";
import { createRelatorioFeature } from "./factories/relatorioFactory";

async function main(): Promise<void> {
  const io = new CLIReadLine();
  const presenter = new ConsolePresenter();
  const menuLoop: MenuLoopRunner = new MenuLoop(io, presenter);
  const context = { pool, io, presenter, menuLoop };

  const autorFeature = createAutorFeature(context);
  const livroFeature = createLivroFeature(context, autorFeature.service);
  const clienteFeature = createClienteFeature(context);
  const emprestimoFeature = createEmprestimoFeature(context, livroFeature.service, clienteFeature.service);
  const relatorioFeature = createRelatorioFeature(context);

  const mainMenu: MainMenuRunner = new MainMenu(
    menuLoop,
    presenter,
    autorFeature.menu,
    livroFeature.menu,
    clienteFeature.menu,
    emprestimoFeature.menu,
    relatorioFeature.menu
  );

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
