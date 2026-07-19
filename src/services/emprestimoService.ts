import { EmprestimoCreateDTO, EmprestimoUpdateDTO } from "../dto/emprestimo";
import { Emprestimo } from "../models/emprestimo";
import { EmprestimoRepository } from "../repositories/emprestimoRepository";
import { ENTITY_NAMES } from "../shared/constants/entities";
import { EMPRESTIMO_PERIODO_DIAS } from "../shared/constants/validation";
import { EntityNotFoundError, ValidationError } from "../shared/errors/domainErrors";
import { BookService } from "./bookService";
import { ClienteService } from "./clienteService";
import { Service } from "./types";

export interface EmprestimoService extends Service<Emprestimo, EmprestimoCreateDTO, EmprestimoUpdateDTO, number> {
  findByClienteId(clienteId: number): Promise<Emprestimo[]>;
  findByLivroId(livroId: number): Promise<Emprestimo[]>;
}

export class DefaultEmprestimoService implements EmprestimoService {
  constructor(
    private readonly repository: EmprestimoRepository,
    private readonly bookService: BookService,
    private readonly clienteService: ClienteService
  ) { }

  list(): Promise<Emprestimo[]> {
    return this.repository.list();
  }

  findById(id: number): Promise<Emprestimo | null> {
    return this.repository.findById(id);
  }

  findByClienteId(clienteId: number): Promise<Emprestimo[]> {
    return this.repository.findByClienteId(clienteId);
  }

  findByLivroId(livroId: number): Promise<Emprestimo[]> {
    return this.repository.findByLivroId(livroId);
  }

  async create(dto: EmprestimoCreateDTO): Promise<Emprestimo> {
    const livro = await this.bookService.findById(dto.livroId);

    if (!livro) {
      throw new EntityNotFoundError(ENTITY_NAMES.LIVRO, dto.livroId);
    }

    const cliente = await this.clienteService.findById(dto.clienteId);

    if (!cliente) {
      throw new EntityNotFoundError(ENTITY_NAMES.CLIENTE, dto.clienteId);
    }

    if (livro.qtdDisponivel < 1) {
      throw new ValidationError(`O livro "${livro.titulo}" não possui unidades disponíveis para empréstimo.`);
    }

    const dataEmprestimo = new Date();

    return this.repository.emprestar({
      dataEmprestimo,
      dataVencimento: this.calcularDataVencimento(dataEmprestimo),
      dataDevolucao: null,
      clienteId: dto.clienteId,
      livroId: dto.livroId,
    });
  }

  async update(id: number, dto: EmprestimoUpdateDTO): Promise<Emprestimo> {
    const campos = Object.keys(dto);
    const apenasDevolucao = campos.length === 1 && campos[0] === "dataDevolucao";

    if (!apenasDevolucao) {
      throw new ValidationError("Só é possível atualizar um empréstimo para registrar a devolução do livro.");
    }

    const emprestimo = await this.repository.findById(id);

    if (!emprestimo) {
      throw new EntityNotFoundError(ENTITY_NAMES.EMPRESTIMO, id);
    }

    if (emprestimo.dataDevolucao !== null) {
      throw new ValidationError("Este empréstimo já foi devolvido.");
    }

    const livro = await this.bookService.findById(emprestimo.livroId);

    if (!livro) {
      throw new EntityNotFoundError(ENTITY_NAMES.LIVRO, emprestimo.livroId);
    }

    return this.repository.devolver(id, emprestimo.livroId, new Date());
  }

  async delete(id: number): Promise<void> {
    const emprestimo = await this.repository.findById(id);

    if (!emprestimo) {
      throw new EntityNotFoundError(ENTITY_NAMES.EMPRESTIMO, id);
    }

    if (emprestimo.dataDevolucao === null) {
      await this.repository.deleteAndRestock(id, emprestimo.livroId);
      return;
    }

    await this.repository.delete(id);
  }

  private calcularDataVencimento(dataEmprestimo: Date): Date {
    const dataVencimento = new Date(dataEmprestimo);
    dataVencimento.setDate(dataVencimento.getDate() + EMPRESTIMO_PERIODO_DIAS);
    return dataVencimento;
  }
}
