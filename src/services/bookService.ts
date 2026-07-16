import { BookCreateDTO, BookFilterDTO, BookUpdateDTO } from "../dto/livro";
import { Book } from "../models/livro";
import { BookRepository } from "../repositories/bookRepository";
import { ValidationError } from "../shared/errors/domainErrors";
import { CrudService } from "./crudService";
import { Service } from "./types";

export interface BookService extends Service<Book, BookCreateDTO, BookUpdateDTO, number> {
  findByName(name: string): Promise<Book[] | null>;
  findByData(dto: BookFilterDTO): Promise<Book | null>;
}

export class DefaultBookService implements BookService {
  private readonly crudService: Service<Book, BookCreateDTO, BookUpdateDTO, number>;

  constructor(private readonly repository: BookRepository) {
    this.crudService = new CrudService(repository);
  }

  list(): Promise<Book[]> {
    return this.crudService.list();
  }

  create(dto: BookCreateDTO): Promise<Book> {
    this.validate(dto);
    return this.crudService.create(dto);
  }

  update(id: number, dto: BookUpdateDTO): Promise<Book> {
    this.validate(dto);
    return this.crudService.update(id, dto);
  }

  delete(id: number): Promise<void> {
    return this.crudService.delete(id);
  }

  findById(id: number): Promise<Book | null> {
    return this.crudService.findById(id);
  }

  findByName(name: string): Promise<Book[] | null> {
    return this.repository.findByName(name);
  }

  findByData(dto: BookFilterDTO): Promise<Book | null> {
    return this.repository.findByData(dto);
  }

  private validate(dto: BookCreateDTO | BookUpdateDTO): void {
    if (dto.titulo !== undefined && dto.titulo.trim().length === 0) {
      throw new ValidationError("O título do livro não pode ser vazio.");
    }

    if (
      dto.qtdDisponivel !== undefined &&
      dto.qtdDisponivel < 1
    ) {
      throw new ValidationError(
        "É preciso ter pelo menos uma unidade de livro para cadastro."
      );
    }

    if (dto.autorId !== undefined) {
      throw new ValidationError("É preciso informar um id de autor.")
    }
  }
}
