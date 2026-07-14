import { AutorCreateDTO, AutorUpdateDTO } from "../dto/autor";
import { Autor } from "../models/autor";
import { CrudRepository } from "../repositories/types";
import { Service } from "./types";

export class AutorService implements Service<Autor, AutorCreateDTO, AutorUpdateDTO, number> {
  constructor(private readonly repository: CrudRepository<Autor>) { };

  list(): Promise<Autor[]> {
    throw new Error("Method not implemented.");
  }
  create(entity: AutorCreateDTO): Promise<Autor> {
    throw new Error("Method not implemented.");
  }
  update(id: number, entity: Partial<Omit<Autor, "id">>): Promise<Autor> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: number): Promise<Autor | null> {
    throw new Error("Method not implemented.");
  }
}