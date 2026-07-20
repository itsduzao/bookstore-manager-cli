import type { Pool } from "pg";
import { BookCreateDTO, BookFilterDTO, BookUpdateDTO } from "../dto/livro";
import { Book } from "../models/livro";
import { NAME_SEARCH_RESULT_LIMIT, TABLES } from "../shared/constants/database";
import { EmptyPayloadError } from "../shared/errors/domainErrors";
import { bookMapper, BookRow } from "./mappers/bookMapper";
import { PostgresCrudRepository } from "./postgresCrudRepository";
import { CrudRepository, DataFilterRepository, NamedLookupRepository } from "./types";

export interface BookRepository
  extends CrudRepository<Book, BookCreateDTO, BookUpdateDTO, number>,
  NamedLookupRepository<Book>,
  DataFilterRepository<Book, BookFilterDTO> { }

export class DefaultBookRepository implements BookRepository {
  private readonly crudRepository: CrudRepository<Book, BookCreateDTO, BookUpdateDTO, number>;

  constructor(
    private readonly pool: Pool,
    private readonly table: string = TABLES.LIVROS
  ) {
    this.crudRepository = new PostgresCrudRepository<Book, BookCreateDTO, BookUpdateDTO>(
      pool,
      table,
      bookMapper
    );
  }

  list(): Promise<Book[]> {
    return this.crudRepository.list();
  }

  create(dto: BookCreateDTO): Promise<Book> {
    return this.crudRepository.create(dto);
  }

  update(id: number, dto: BookUpdateDTO): Promise<Book> {
    return this.crudRepository.update(id, dto);
  }

  delete(id: number): Promise<void> {
    return this.crudRepository.delete(id);
  }

  findById(id: number): Promise<Book | null> {
    return this.crudRepository.findById(id);
  }

  async findByName(name: string): Promise<Book[] | null> {
    const query = `SELECT * FROM ${this.table} WHERE titulo = $1 LIMIT ${NAME_SEARCH_RESULT_LIMIT}`;
    const result = await this.pool.query<BookRow>(query, [name]);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows.map(row => bookMapper.mapRowToEntity(row));
  }

  async findByData(dto: BookFilterDTO): Promise<Book | null> {
    const data = bookMapper.mapFilterDtoToRow(dto);
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new EmptyPayloadError("buscar um livro");
    }

    const values = Object.values(data);
    const conditions = columns.map((column, index) => `${column} = $${index + 1}`).join(" AND ");

    const query = `
      SELECT *
      FROM ${this.table}
      WHERE ${conditions}
      LIMIT 1
    `;

    const result = await this.pool.query<BookRow>(query, values);

    if (result.rowCount === 0) {
      return null;
    }

    return bookMapper.mapRowToEntity(result.rows[0]);
  }
}
