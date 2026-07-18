import { CliIO } from "../cli/IO/types";
import { UiPresenter } from "../cli/presenters/types";
import { ClienteFilterDTO } from "../dto/cliente";
import { Cliente } from "../models/cliente";
import { ClienteService } from "../services/clienteService";
import { ENTITY_NAMES } from "../shared/constants/entities";
import { CrudController } from "./crudController";
import { ClienteFormatter, ClientePrompter } from "./support/clientePresentation";
import { presentControllerError } from "./support/errorPresenter";
import { EntityFormatter } from "./support/types";
import { Controller } from "./types";

export interface ClienteController extends Controller {
  findByName(): Promise<void>;
  findByData(): Promise<void>;
}

export class DefaultClienteController implements ClienteController {
  private readonly crudController: Controller;
  private readonly formatter: EntityFormatter<Cliente>;
  private readonly prompter: ClientePrompter;

  constructor(
    private readonly service: ClienteService,
    private readonly io: CliIO,
    private readonly presenter: UiPresenter
  ) {
    this.formatter = new ClienteFormatter();
    this.prompter = new ClientePrompter(io);

    this.crudController = new CrudController(
      service,
      io,
      presenter,
      this.formatter,
      this.prompter,
      ENTITY_NAMES.CLIENTE
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
      const name = await this.io.ask("Nome do cliente a ser buscado: ");
      const clientes = await this.service.findByName(name);

      if (!clientes || clientes.length === 0) {
        this.presenter.showInfo("Nenhum cliente encontrado com esse nome.");
        return;
      }

      this.presenter.showList(clientes.map(cliente => this.formatter.formatSummary(cliente)));
      this.presenter.showSuccess(`${clientes.length} cliente(es) encontrado(s).`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async findByData(): Promise<void> {
    try {
      const dto: ClienteFilterDTO = await this.prompter.promptFilter();
      const cliente = await this.service.findByData(dto);

      if (!cliente) {
        this.presenter.showInfo("Nenhum cliente encontrado com os dados informados.");
        return;
      }

      this.presenter.showList(this.formatter.formatDetails(cliente));
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }
}