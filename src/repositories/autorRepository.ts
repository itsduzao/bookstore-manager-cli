import type { Pool } from "pg";
import { AutorCreateDTO, AutorFilterDTO, AutorUpdateDTO } from "../dto/autor";
import { Autor } from "../models/autor";
import { NAME_SEARCH_RESULT_LIMIT, TABLES } from "../shared/constants/database";
import { EmptyPayloadError } from "../shared/errors/domainErrors";
import { autorMapper, AutorRow } from "./mappers/autorMapper";
import { PostgresCrudRepository } from "./postgresCrudRepository";
import { CrudRepository, DataFilterRepository, NamedLookupRepository } from "./types";

export interface AutorRepositoryPort
  extends CrudRepository<Autor, AutorCreateDTO, AutorUpdateDTO, number>,
  NamedLookupRepository<Autor>,
  DataFilterRepository<Autor, AutorFilterDTO> { }

export class AutorRepository implements AutorRepositoryPort {
  private readonly crudRepository: CrudRepository<Autor, AutorCreateDTO, AutorUpdateDTO, number>;

  constructor(
    private readonly pool: Pool,
    private readonly table: string = TABLES.AUTORES
  ) {
    this.crudRepository = new PostgresCrudRepository<Autor, AutorCreateDTO, AutorUpdateDTO>(
      pool,
      table,
      autorMapper
    );
  }

  list(): Promise<Autor[]> {
    return this.crudRepository.list();
  }

  create(dto: AutorCreateDTO): Promise<Autor> {
    return this.crudRepository.create(dto);
  }

  update(id: number, dto: AutorUpdateDTO): Promise<Autor> {
    return this.crudRepository.update(id, dto);
  }

  delete(id: number): Promise<void> {
    return this.crudRepository.delete(id);
  }

  findById(id: number): Promise<Autor | null> {
    return this.crudRepository.findById(id);
  }

  async findByName(name: string): Promise<Autor[] | null> {
    const query = `SELECT * FROM ${this.table} WHERE nome = $1 LIMIT ${NAME_SEARCH_RESULT_LIMIT}`;
    const result = await this.pool.query<AutorRow>(query, [name]);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows.map(row => autorMapper.mapRowToEntity(row));
  }

  async findByData(dto: AutorFilterDTO): Promise<Autor | null> {
    const data = autorMapper.mapFilterDtoToRow(dto);
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new EmptyPayloadError("buscar um autor");
    }

    const values = Object.values(data);
    const conditions = columns.map((column, index) => `${column} = $${index + 1}`).join(" AND ");

    const query = `
      SELECT *
      FROM ${this.table}
      WHERE ${conditions}
      LIMIT 1
    `;

    const result = await this.pool.query<AutorRow>(query, values);

    if (result.rowCount === 0) {
      return null;
    }

    return autorMapper.mapRowToEntity(result.rows[0]);
  }
}
