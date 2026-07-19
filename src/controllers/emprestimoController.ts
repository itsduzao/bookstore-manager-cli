import { CliIO } from "../cli/IO/types";
import { UiPresenter } from "../cli/presenters/types";
import { Emprestimo } from "../models/emprestimo";
import { BookService } from "../services/bookService";
import { ClienteService } from "../services/clienteService";
import { EmprestimoService } from "../services/emprestimoService";
import { ENTITY_NAMES } from "../shared/constants/entities";
import { CrudController } from "./crudController";
import { EmprestimoFormatter, EmprestimoPrompter } from "./support/emprestimoPresentation";
import { presentControllerError } from "./support/errorPresenter";
import { EntityFormatter } from "./support/types";
import { Controller } from "./types";

export interface EmprestimoController extends Controller {
  findByCliente(): Promise<void>;
  findByLivro(): Promise<void>;
}

export class DefaultEmprestimoController implements EmprestimoController {
  private readonly crudController: Controller;
  private readonly formatter: EntityFormatter<Emprestimo>;

  constructor(
    private readonly service: EmprestimoService,
    private readonly bookService: BookService,
    private readonly clienteService: ClienteService,
    private readonly io: CliIO,
    private readonly presenter: UiPresenter
  ) {
    this.formatter = new EmprestimoFormatter();

    this.crudController = new CrudController(
      service,
      io,
      presenter,
      this.formatter,
      new EmprestimoPrompter(io),
      ENTITY_NAMES.EMPRESTIMO
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

  async findByCliente(): Promise<void> {
    try {
      const clienteId = await this.io.askInt("Informe o id do cliente: ", { min: 1 });
      const emprestimos = await this.service.findByClienteId(clienteId);

      if (emprestimos.length === 0) {
        this.presenter.showInfo("Nenhum empréstimo encontrado para esse cliente.");
        return;
      }

      this.presenter.showList(await this.describeComLivro(emprestimos));
      this.presenter.showSuccess(`${emprestimos.length} registro(s) encontrado(s).`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async findByLivro(): Promise<void> {
    try {
      const livroId = await this.io.askInt("Informe o id do livro: ", { min: 1 });
      const emprestimos = await this.service.findByLivroId(livroId);

      if (emprestimos.length === 0) {
        this.presenter.showInfo("Nenhum empréstimo encontrado para esse livro.");
        return;
      }

      this.presenter.showList(await this.describeComCliente(emprestimos));
      this.presenter.showSuccess(`${emprestimos.length} registro(s) encontrado(s).`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  private async describeComLivro(emprestimos: Emprestimo[]): Promise<string[]> {
    return Promise.all(emprestimos.map(async emprestimo => {
      const livro = await this.bookService.findById(emprestimo.livroId);
      const livroLabel = livro ? `"${livro.titulo}"` : `livro #${emprestimo.livroId}`;

      return `${this.formatter.formatSummary(emprestimo)} — ${livroLabel}`;
    }));
  }

  private async describeComCliente(emprestimos: Emprestimo[]): Promise<string[]> {
    return Promise.all(emprestimos.map(async emprestimo => {
      const cliente = await this.clienteService.findById(emprestimo.clienteId);
      const clienteLabel = cliente ? cliente.nome : `cliente #${emprestimo.clienteId}`;

      return `${this.formatter.formatSummary(emprestimo)} — ${clienteLabel}`;
    }));
  }
}
