import type { Pool } from "pg";
import { AutorDTO } from "../dto/autor";
import { Autor } from "../models/autor";
import { Repository } from "./types";

export class AutorRepository implements Repository<Autor> {
  constructor(private pool: Pool, private table: string) { }

  async list(): Promise<Array<Autor>> {
    const query = `SELECT * FROM ${this.table}`

    const result = await this.pool.query<Autor>(query)

    return result.rows
  }

  async create(autor: AutorDTO): Promise<Autor> {
    // TODO
  }

  async findById(id: string): Promise<Autor | null> {
    // TODO
  }

  async findByName(name: string): Promise<Autor | null> {
    // TODO
  }


}