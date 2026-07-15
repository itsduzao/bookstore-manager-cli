type DbRow = Record<string, unknown>;

export interface EntityMapper<TEntity, TCreateDTO, TUpdateDTO> {
  mapRowToEntity(row: DbRow): TEntity;
  mapCreateDtoToRow(dto: TCreateDTO): DbRow;
  mapUpdateDtoToRow(dto: TUpdateDTO): DbRow;
}

export interface FilterMapper<TFilterDTO> {
  mapFilterDtoToRow(dto: TFilterDTO): DbRow;
}
