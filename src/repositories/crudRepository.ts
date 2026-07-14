import type { Pool } from "pg";

type DbRow = Record<string, unknown>;

export abstract class CrudRepository<TEntity, TCreateDTO, TUpdateDTO = Partial<TCreateDTO>, TId = number> {
  protected constructor(
    protected readonly pool: Pool,
    protected readonly table: string,
    protected readonly idColumn = "id"
  ) { }

  protected abstract mapRowToEntity(row: DbRow): TEntity;
  protected abstract mapCreateDTOToRow(dto: TCreateDTO): DbRow;
  protected abstract mapUpdateDTOToRow(dto: TUpdateDTO): DbRow;

  async list(): Promise<TEntity[]> {
    const result = await this.pool.query<DbRow>(`SELECT * FROM ${this.table}`);
    return result.rows.map(row => this.mapRowToEntity(row));
  }

  async create(dto: TCreateDTO): Promise<TEntity> {
    const data = this.mapCreateDTOToRow(dto);
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new Error("Não é possivel criar uma entidade sem dados.");
    }

    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `
      INSERT INTO ${this.table} (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.pool.query<DbRow>(query, values);
    return this.mapRowToEntity(result.rows[0]);
  }

  async update(id: TId, dto: TUpdateDTO): Promise<TEntity> {
    const data = this.mapUpdateDTOToRow(dto);
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new Error("Cannot update an entity without data.");
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
    return this.mapRowToEntity(result.rows[0]);
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

    return this.mapRowToEntity(result.rows[0]);
  }
}