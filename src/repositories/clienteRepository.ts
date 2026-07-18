import { Pool } from "pg";
import { ClienteCreateDTO, ClienteFilterDTO, ClienteUpdateDTO } from "../dto/cliente";
import { Cliente } from "../models/cliente";
import { NAME_SEARCH_RESULT_LIMIT, TABLES } from "../shared/constants/database";
import { EmptyPayloadError } from "../shared/errors/domainErrors";
import { clienteMapper, ClienteRow } from "./mappers/clienteMapper";
import { PostgresCrudRepository } from "./postgresCrudRepository";
import { CrudRepository, DataFilterRepository, NamedLookupRepository } from "./types";

export interface ClienteRepository
  extends CrudRepository<Cliente, ClienteCreateDTO, ClienteUpdateDTO, number>,
  NamedLookupRepository<Cliente>,
  DataFilterRepository<Cliente, ClienteFilterDTO> { };

export class DefaultClienteRepository implements ClienteRepository {
  private readonly crudRepository: PostgresCrudRepository<Cliente, ClienteCreateDTO, ClienteUpdateDTO, number>;

  constructor(
    private readonly pool: Pool,
    private readonly table: string = TABLES.CLIENTES
  ) {
    this.crudRepository = new PostgresCrudRepository<Cliente, ClienteCreateDTO, ClienteUpdateDTO>(
      pool,
      table,
      clienteMapper
    );
  }

  list(): Promise<Cliente[]> {
    return this.crudRepository.list();
  }
  create(dto: ClienteCreateDTO): Promise<Cliente> {
    return this.crudRepository.create(dto);
  }
  update(id: number, dto: Partial<ClienteCreateDTO>): Promise<Cliente> {
    return this.crudRepository.update(id, dto);
  }
  delete(id: number): Promise<void> {
    return this.crudRepository.delete(id);
  }
  findById(id: number): Promise<Cliente | null> {
    return this.crudRepository.findById(id);
  }

  async findByName(name: string): Promise<Cliente[] | null> {
    const query = `SELECT * FROM ${this.table} WHERE nome = $1 LIMIT ${NAME_SEARCH_RESULT_LIMIT}`;
    const result = await this.pool.query<ClienteRow>(query, [name]);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows.map(row => clienteMapper.mapRowToEntity(row));
  }

  async findByData(dto: ClienteFilterDTO): Promise<Cliente | null> {
    const data = clienteMapper.mapFilterDtoToRow(dto);
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

    const result = await this.pool.query<ClienteRow>(query, values);

    if (result.rowCount === 0) {
      return null;
    }

    return clienteMapper.mapRowToEntity(result.rows[0]);
  }
}

