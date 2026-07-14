export interface Service<TEntity, TCreateDTO = TEntity, TUpdateDTO = Partial<TCreateDTO>, TId = number> {
  list(): Promise<TEntity[]>;
  create(entity: TCreateDTO): Promise<TEntity>;
  update(id: TId, entity: TUpdateDTO): Promise<TEntity>;
  delete(id: TId): Promise<void>;
  findById(id: TId): Promise<TEntity | null>;
}