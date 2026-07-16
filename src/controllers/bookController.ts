import { CliIO } from "../cli/IO/types";
import { UiPresenter } from "../cli/presenters/types";
import { BookFilterDTO } from "../dto/livro";
import { Book } from "../models/livro";
import { BookService } from "../services/bookService";
import { ENTITY_NAMES } from "../shared/constants/entities";
import { CrudController } from "./crudController";
import { BookFormatter, BookPrompter } from "./support/bookPresentation";
import { presentControllerError } from "./support/errorPresenter";
import { EntityFormatter } from "./support/types";
import { Controller } from "./types";

export interface BookController extends Controller {
  findByName(): Promise<void>;
  findByData(): Promise<void>;
}

export class DefaultBookController implements BookController {
  private readonly crudController: Controller;
  private readonly formatter: EntityFormatter<Book>;
  private readonly prompter: BookPrompter;

  constructor(
    private readonly service: BookService,
    private readonly io: CliIO,
    private readonly presenter: UiPresenter
  ) {
    this.formatter = new BookFormatter();
    this.prompter = new BookPrompter(io);

    this.crudController = new CrudController(
      service,
      io,
      presenter,
      this.formatter,
      this.prompter,
      ENTITY_NAMES.LIVRO
    );
  }

  list(): Promise<void> {
    return this.crudController.list();
  }

  create(): Promise<void> {
    return this.crudController.create();
  }

  update(): Promise<void> {
    return this.crudController.update();
  }

  delete(): Promise<void> {
    return this.crudController.delete();
  }

  findById(): Promise<void> {
    return this.crudController.findById();
  }

  async findByName(): Promise<void> {
    try {
      const bookTitle = await this.io.ask("Título do livro a ser buscado: ");
      const bookList = await this.service.findByName(bookTitle);

      if (!bookList || bookList.length === 0) {
        this.presenter.showInfo("Nenhum livro encontrado com esse título.");
        return;
      }

      this.presenter.showList(bookList.map(autor => this.formatter.formatSummary(autor)));
      this.presenter.showSuccess(`${bookList.length} livros encontrados.`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async findByData(): Promise<void> {
    try {
      const dto: BookFilterDTO = await this.prompter.promptFilter();
      const book = await this.service.findByData(dto);

      if (!book) {
        this.presenter.showInfo("Nenhum livro encontrado com os dados informados.");
        return;
      }

      this.presenter.showList(this.formatter.formatDetails(book));
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }
}