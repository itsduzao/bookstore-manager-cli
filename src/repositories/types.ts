import { AutorLookUpDTO } from "../dto/autor";
import { Autor } from "../models/autor";

export interface CrudRepository<TEntity, TCreateDTO = TEntity, TUpdateDTO = Partial<TCreateDTO>, TId = number> {
  list(): Promise<TEntity[]>;
  create(entity: TCreateDTO): Promise<TEntity>;
  update(id: TId, entity: TUpdateDTO): Promise<TEntity>;
  delete(id: TId): Promise<void>;
  findById(id: TId): Promise<TEntity | null>;
}

export interface NamedLookupRepository<TEntity> {
  findByName(name: string): Promise<TEntity[] | null>;
}

export interface DataLookupRepository<TEntity, TLookUpDTO> {
  findByData(dto: TLookUpDTO): Promise<TEntity | null>
}

export interface AutorRepository extends CrudRepository<Autor>, DataLookupRepository<Autor, AutorLookUpDTO> { }