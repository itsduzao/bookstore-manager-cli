import { AutorMenu, AutorMenuRunner } from "../cli/menus/autorMenu";
import { DefaultAutorController } from "../controllers/autorController";
import { DefaultAutorRepository } from "../repositories/autorRepository";
import { AutorService, DefaultAutorService } from "../services/autorService";
import { Feature, FeatureFactoryContext } from "./types";

export function createAutorFeature(context: FeatureFactoryContext): Feature<AutorMenuRunner, AutorService> {
  const repository = new DefaultAutorRepository(context.pool);
  const service = new DefaultAutorService(repository);
  const controller = new DefaultAutorController(service, context.io, context.presenter);

  return { menu: new AutorMenu(context.menuLoop, controller), service };
}
