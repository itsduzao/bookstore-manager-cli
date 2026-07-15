import { CrudRepository } from "../repositories/types";
import { Service } from "./types";

export class CrudService<TEntity, TCreateDTO, TUpdateDTO = Partial<TCreateDTO>, TId = number>
  implements Service<TEntity, TCreateDTO, TUpdateDTO, TId> {

  constructor(private readonly repository: CrudRepository<TEntity, TCreateDTO, TUpdateDTO, TId>) { }

  list(): Promise<TEntity[]> {
    return this.repository.list();
  }

  create(dto: TCreateDTO): Promise<TEntity> {
    return this.repository.create(dto);
  }

  update(id: TId, dto: TUpdateDTO): Promise<TEntity> {
    return this.repository.update(id, dto);
  }

  delete(id: TId): Promise<void> {
    return this.repository.delete(id);
  }

  findById(id: TId): Promise<TEntity | null> {
    return this.repository.findById(id);
  }
}
