import type { Pool, PoolClient } from "pg";
import { EmprestimoRecordDTO, EmprestimoUpdateDTO } from "../dto/emprestimo";
import { Emprestimo } from "../models/emprestimo";
import { TABLES } from "../shared/constants/database";
import { ENTITY_NAMES } from "../shared/constants/entities";
import { EntityNotFoundError, ValidationError } from "../shared/errors/domainErrors";
import { emprestimoMapper, EmprestimoRow } from "./mappers/emprestimoMapper";
import { PostgresCrudRepository } from "./postgresCrudRepository";
import { CrudRepository } from "./types";

export interface EmprestimoRepository {
  list(): Promise<Emprestimo[]>;
  findById(id: number): Promise<Emprestimo | null>;
  delete(id: number): Promise<void>;
  findByClienteId(clienteId: number): Promise<Emprestimo[]>;
  findByLivroId(livroId: number): Promise<Emprestimo[]>;
  emprestar(record: EmprestimoRecordDTO): Promise<Emprestimo>;
  devolver(id: number, livroId: number, dataDevolucao: Date): Promise<Emprestimo>;
  deleteAndRestock(id: number, livroId: number): Promise<void>;
}

export class DefaultEmprestimoRepository implements EmprestimoRepository {
  private readonly crudRepository: CrudRepository<Emprestimo, EmprestimoRecordDTO, EmprestimoUpdateDTO, number>;

  constructor(
    private readonly pool: Pool,
    private readonly table: string = TABLES.EMPRESTIMOS,
    private readonly livrosTable: string = TABLES.LIVROS
  ) {
    this.crudRepository = new PostgresCrudRepository<Emprestimo, EmprestimoRecordDTO, EmprestimoUpdateDTO>(
      pool,
      table,
      emprestimoMapper
    );
  }

  list(): Promise<Emprestimo[]> {
    return this.crudRepository.list();
  }

  findById(id: number): Promise<Emprestimo | null> {
    return this.crudRepository.findById(id);
  }

  delete(id: number): Promise<void> {
    return this.crudRepository.delete(id);
  }

  async findByClienteId(clienteId: number): Promise<Emprestimo[]> {
    const query = `SELECT * FROM ${this.table} WHERE cliente_id = $1 ORDER BY data_emprestimo DESC`;
    const result = await this.pool.query<EmprestimoRow>(query, [clienteId]);

    return result.rows.map(row => emprestimoMapper.mapRowToEntity(row));
  }

  async findByLivroId(livroId: number): Promise<Emprestimo[]> {
    const query = `SELECT * FROM ${this.table} WHERE livro_id = $1 ORDER BY data_emprestimo DESC`;
    const result = await this.pool.query<EmprestimoRow>(query, [livroId]);

    return result.rows.map(row => emprestimoMapper.mapRowToEntity(row));
  }

  async emprestar(record: EmprestimoRecordDTO): Promise<Emprestimo> {
    return this.runInTransaction(async client => {
      const stockResult = await client.query(
        `UPDATE ${this.livrosTable}
         SET quantidade_disponivel = quantidade_disponivel - 1
         WHERE id = $1 AND quantidade_disponivel > 0`,
        [record.livroId]
      );

      if (stockResult.rowCount === 0) {
        throw new ValidationError("O livro não possui unidades disponíveis para empréstimo.");
      }

      const data = emprestimoMapper.mapCreateDtoToRow(record);
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

      const insertResult = await client.query<EmprestimoRow>(
        `INSERT INTO ${this.table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
        values
      );

      return emprestimoMapper.mapRowToEntity(insertResult.rows[0]);
    });
  }

  async devolver(id: number, livroId: number, dataDevolucao: Date): Promise<Emprestimo> {
    return this.runInTransaction(async client => {
      const updateResult = await client.query<EmprestimoRow>(
        `UPDATE ${this.table}
         SET data_devolucao = $1
         WHERE id = $2 AND data_devolucao IS NULL
         RETURNING *`,
        [dataDevolucao, id]
      );

      if (updateResult.rowCount === 0) {
        throw new ValidationError("Este empréstimo não existe ou já foi devolvido.");
      }

      await client.query(
        `UPDATE ${this.livrosTable} SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = $1`,
        [livroId]
      );

      return emprestimoMapper.mapRowToEntity(updateResult.rows[0]);
    });
  }

  async deleteAndRestock(id: number, livroId: number): Promise<void> {
    await this.runInTransaction(async client => {
      const deleteResult = await client.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);

      if (deleteResult.rowCount === 0) {
        throw new EntityNotFoundError(ENTITY_NAMES.EMPRESTIMO, id);
      }

      await client.query(
        `UPDATE ${this.livrosTable} SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = $1`,
        [livroId]
      );
    });
  }

  private async runInTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
