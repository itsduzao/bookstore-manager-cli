import { ClienteMenu, ClienteMenuRunner } from "../cli/menus/clienteMenu";
import { DefaultClienteController } from "../controllers/clienteController";
import { DefaultClienteRepository } from "../repositories/clienteRepository";
import { ClienteService, DefaultClienteService } from "../services/clienteService";
import { Feature, FeatureFactoryContext } from "./types";

export function createClienteFeature(context: FeatureFactoryContext): Feature<ClienteMenuRunner, ClienteService> {
  const repository = new DefaultClienteRepository(context.pool);
  const service = new DefaultClienteService(repository);
  const controller = new DefaultClienteController(service, context.io, context.presenter);

  return { menu: new ClienteMenu(context.menuLoop, controller), service };
}
