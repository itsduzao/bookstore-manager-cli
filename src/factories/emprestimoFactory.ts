import { EmprestimoMenu, EmprestimoMenuRunner } from "../cli/menus/emprestimoMenu";
import { DefaultEmprestimoController } from "../controllers/emprestimoController";
import { DefaultEmprestimoRepository } from "../repositories/emprestimoRepository";
import { BookService } from "../services/bookService";
import { ClienteService } from "../services/clienteService";
import { DefaultEmprestimoService, EmprestimoService } from "../services/emprestimoService";
import { Feature, FeatureFactoryContext } from "./types";

export function createEmprestimoFeature(
  context: FeatureFactoryContext,
  bookService: BookService,
  clienteService: ClienteService
): Feature<EmprestimoMenuRunner, EmprestimoService> {
  const repository = new DefaultEmprestimoRepository(context.pool);
  const service = new DefaultEmprestimoService(repository, bookService, clienteService);
  const controller = new DefaultEmprestimoController(
    service,
    bookService,
    clienteService,
    context.io,
    context.presenter
  );

  return { menu: new EmprestimoMenu(context.menuLoop, controller), service };
}
