export interface Service<TEntity, TCreateDTO = TEntity, TUpdateDTO = Partial<TCreateDTO>, TId = number> {
  list(): Promise<TEntity[]>;
  create(dto: TCreateDTO): Promise<TEntity>;
  update(id: TId, dto: TUpdateDTO): Promise<TEntity>;
  delete(id: TId): Promise<void>;
  findById(id: TId): Promise<TEntity | null>;
}
