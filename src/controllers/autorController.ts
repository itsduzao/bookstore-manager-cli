import { CliIO } from "../cli/IO/types";
import { UiPresenter } from "../cli/presenters/types";
import { AutorFilterDTO } from "../dto/autor";
import { Autor } from "../models/autor";
import { AutorService } from "../services/autorService";
import { ENTITY_NAMES } from "../shared/constants/entities";
import { CrudController } from "./crudController";
import { AutorFormatter, AutorPrompter } from "./support/autorPresentation";
import { presentControllerError } from "./support/errorPresenter";
import { EntityFormatter } from "./support/types";
import { Controller } from "./types";

export interface AutorController extends Controller {
  findByName(): Promise<void>;
  findByData(): Promise<void>;
}

export class DefaultAutorController implements AutorController {
  private readonly crudController: Controller;
  private readonly formatter: EntityFormatter<Autor>;
  private readonly prompter: AutorPrompter;

  constructor(
    private readonly service: AutorService,
    private readonly io: CliIO,
    private readonly presenter: UiPresenter
  ) {
    this.formatter = new AutorFormatter();
    this.prompter = new AutorPrompter(io);

    this.crudController = new CrudController(
      service,
      io,
      presenter,
      this.formatter,
      this.prompter,
      ENTITY_NAMES.AUTOR
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
      const name = await this.io.ask("Nome do autor a ser buscado: ");
      const autores = await this.service.findByName(name);

      if (!autores || autores.length === 0) {
        this.presenter.showInfo("Nenhum autor encontrado com esse nome.");
        return;
      }

      this.presenter.showList(autores.map(autor => this.formatter.formatSummary(autor)));
      this.presenter.showSuccess(`${autores.length} autor(es) encontrado(s).`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async findByData(): Promise<void> {
    try {
      const dto: AutorFilterDTO = await this.prompter.promptFilter();
      const autor = await this.service.findByData(dto);

      if (!autor) {
        this.presenter.showInfo("Nenhum autor encontrado com os dados informados.");
        return;
      }

      this.presenter.showList(this.formatter.formatDetails(autor));
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }
}