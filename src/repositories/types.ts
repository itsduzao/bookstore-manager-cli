export interface CrudRepository<TEntity, TCreateDTO = TEntity, TUpdateDTO = Partial<TCreateDTO>, TId = number> {
  list(): Promise<TEntity[]>;
  create(dto: TCreateDTO): Promise<TEntity>;
  update(id: TId, dto: TUpdateDTO): Promise<TEntity>;
  delete(id: TId): Promise<void>;
  findById(id: TId): Promise<TEntity | null>;
}

export interface NamedLookupRepository<TEntity> {
  findByName(name: string): Promise<TEntity[] | null>;
}

export interface DataFilterRepository<TEntity, TLookUpDTO> {
  findByData(dto: TLookUpDTO): Promise<TEntity | null>;
}
