import { RelatorioMenu, RelatorioMenuRunner } from "../cli/menus/relatorioMenu";
import { DefaultRelatorioController } from "../controllers/relatorioController";
import { DefaultRelatorioRepository } from "../repositories/relatorioRepository";
import { DefaultRelatorioService, RelatorioService } from "../services/relatorioService";
import { Feature, FeatureFactoryContext } from "./types";

export function createRelatorioFeature(context: FeatureFactoryContext): Feature<RelatorioMenuRunner, RelatorioService> {
  const repository = new DefaultRelatorioRepository(context.pool);
  const service = new DefaultRelatorioService(repository);
  const controller = new DefaultRelatorioController(service, context.presenter);

  return { menu: new RelatorioMenu(context.menuLoop, controller), service };
}
