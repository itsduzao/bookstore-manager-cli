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
import { Controller } from "./types";

export interface EmprestimoController extends Controller {
  findByCliente(): Promise<void>;
  findByLivro(): Promise<void>;
}

export class DefaultEmprestimoController implements EmprestimoController {
  private readonly crudController: Controller;
  private readonly formatter: EmprestimoFormatter;

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

  async list(): Promise<void> {
    try {
      const emprestimos = await this.service.list();

      if (emprestimos.length === 0) {
        this.presenter.showInfo("Nenhum(a) empréstimo cadastrado(a) até o momento.");
        return;
      }

      this.presenter.showList(await this.describeSummaries(emprestimos));
      this.presenter.showSuccess(`${emprestimos.length} registro(s) encontrado(s).`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
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

  async findById(): Promise<void> {
    try {
      const id = await this.io.askInt("Informe o id do(a) empréstimo: ", { min: 1 });
      const emprestimo = await this.service.findById(id);

      if (!emprestimo) {
        this.presenter.showInfo(`Nenhum(a) empréstimo encontrado(a) com o id ${id}.`);
        return;
      }

      this.presenter.showList(await this.describeDetails(emprestimo));
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async findByCliente(): Promise<void> {
    try {
      const clienteId = await this.io.askInt("Informe o id do cliente: ", { min: 1 });
      const emprestimos = await this.service.findByClienteId(clienteId);

      if (emprestimos.length === 0) {
        this.presenter.showInfo("Nenhum empréstimo encontrado para esse cliente.");
        return;
      }

      this.presenter.showList(await this.describeSummaries(emprestimos));
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

      this.presenter.showList(await this.describeSummaries(emprestimos));
      this.presenter.showSuccess(`${emprestimos.length} registro(s) encontrado(s).`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  private async describeSummaries(emprestimos: Emprestimo[]): Promise<string[]> {
    return Promise.all(emprestimos.map(async emprestimo => {
      const { livro, cliente } = await this.loadRelatedData(emprestimo);
      return this.formatter.formatSummary(emprestimo, livro, cliente);
    }));
  }

  private async describeDetails(emprestimo: Emprestimo): Promise<string[]> {
    const { livro, cliente } = await this.loadRelatedData(emprestimo);
    return this.formatter.formatDetails(emprestimo, livro, cliente);
  }

  private async loadRelatedData(emprestimo: Emprestimo): Promise<{ livro: string; cliente: string }> {
    const [livro, cliente] = await Promise.all([
      this.bookService.findById(emprestimo.livroId),
      this.clienteService.findById(emprestimo.clienteId),
    ]);

    return {
      livro: livro ? `"${livro.titulo}"` : `Livro #${emprestimo.livroId}`,
      cliente: cliente ? cliente.nome : `Cliente #${emprestimo.clienteId}`,
    };
  }
}
