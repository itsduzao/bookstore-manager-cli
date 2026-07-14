import type { Pool } from "pg";
import { AutorCreateDTO, AutorUpdateDTO } from "../dto/autor";
import { Autor } from "../models/autor";
import { CrudRepository } from "./crudRepository";
import { NamedLookupRepository } from "./types";

type AutorRow = {
  id: number;
  nome: string;
  ano_nascimento?: number | null;
  nacionalidade?: string | null;
};

export class AutorRepository extends CrudRepository<Autor, AutorCreateDTO, AutorUpdateDTO, number> implements NamedLookupRepository<Autor> {
  constructor(pool: Pool, table: string) {
    super(pool, table);
  }

  async findByName(name: string): Promise<Autor[] | null> {
    const query = `SELECT * FROM ${this.table} WHERE nome = $1 LIMIT 10`;
    const result = await this.pool.query<AutorRow>(query, [name]);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows.map(row => this.mapRowToEntity(row));
  }

  protected mapRowToEntity(row: AutorRow): Autor {
    return {
      id: row.id,
      nome: row.nome,
      anoNascimento: row.ano_nascimento ?? undefined,
      nacionalidade: row.nacionalidade ?? undefined,
    };
  }

  protected mapCreateDTOToRow(dto: AutorCreateDTO): Record<string, unknown> {
    return {
      nome: dto.nome,
      ano_nascimento: dto.anoNascimento,
      nacionalidade: dto.nacionalidade,
    };
  }

  protected mapUpdateDTOToRow(dto: AutorUpdateDTO): Record<string, unknown> {
    return {
      ...(dto.nome !== undefined ? { nome: dto.nome } : {}),
      ...(dto.anoNascimento !== undefined ? { ano_nascimento: dto.anoNascimento } : {}),
      ...(dto.nacionalidade !== undefined ? { nacionalidade: dto.nacionalidade } : {}),
    };
  }


}