import type { Pool } from "pg";
import { DEFAULT_ID_COLUMN } from "../shared/constants/database";
import { EmptyPayloadError } from "../shared/errors/domainErrors";
import { EntityMapper } from "./mappers/types";
import { CrudRepository } from "./types";

type DbRow = Record<string, unknown>;

export class PostgresCrudRepository<TEntity, TCreateDTO, TUpdateDTO = Partial<TCreateDTO>, TId = number>
  implements CrudRepository<TEntity, TCreateDTO, TUpdateDTO, TId> {

  constructor(
    private readonly pool: Pool,
    private readonly table: string,
    private readonly mapper: EntityMapper<TEntity, TCreateDTO, TUpdateDTO>,
    private readonly idColumn: string = DEFAULT_ID_COLUMN
  ) { }

  async list(): Promise<TEntity[]> {
    const result = await this.pool.query<DbRow>(`SELECT * FROM ${this.table}`);
    return result.rows.map(row => this.mapper.mapRowToEntity(row));
  }

  async create(dto: TCreateDTO): Promise<TEntity> {
    const data = this.mapper.mapCreateDtoToRow(dto);
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new EmptyPayloadError("criar um registro");
    }

    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `
      INSERT INTO ${this.table} (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.pool.query<DbRow>(query, values);
    return this.mapper.mapRowToEntity(result.rows[0]);
  }

  async update(id: TId, dto: TUpdateDTO): Promise<TEntity> {
    const data = this.mapper.mapUpdateDtoToRow(dto);
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new EmptyPayloadError("atualizar um registro");
    }

    const values = Object.values(data);
    const assignments = columns.map((column, index) => `${column} = $${index + 1}`).join(", ");

    const query = `
      UPDATE ${this.table}
      SET ${assignments}
      WHERE ${this.idColumn} = $${values.length + 1}
      RETURNING *
    `;

    const result = await this.pool.query<DbRow>(query, [...values, id]);
    return this.mapper.mapRowToEntity(result.rows[0]);
  }

  async delete(id: TId): Promise<void> {
    await this.pool.query(`DELETE FROM ${this.table} WHERE ${this.idColumn} = $1`, [id]);
  }

  async findById(id: TId): Promise<TEntity | null> {
    const query = `SELECT * FROM ${this.table} WHERE ${this.idColumn} = $1 LIMIT 1`;
    const result = await this.pool.query<DbRow>(query, [id]);

    if (result.rowCount === 0) {
      return null;
    }

    return this.mapper.mapRowToEntity(result.rows[0]);
  }
}
