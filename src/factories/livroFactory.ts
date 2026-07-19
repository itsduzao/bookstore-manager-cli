import { BookMenu, BookMenuRunner } from "../cli/menus/bookMenu";
import { DefaultBookController } from "../controllers/bookController";
import { DefaultBookRepository } from "../repositories/bookRepository";
import { AutorService } from "../services/autorService";
import { BookService, DefaultBookService } from "../services/bookService";
import { Feature, FeatureFactoryContext } from "./types";

export function createLivroFeature(
  context: FeatureFactoryContext,
  autorService: AutorService
): Feature<BookMenuRunner, BookService> {
  const repository = new DefaultBookRepository(context.pool);
  const service = new DefaultBookService(repository, autorService);
  const controller = new DefaultBookController(service, context.io, context.presenter);

  return { menu: new BookMenu(context.menuLoop, controller), service };
}
