export interface EntityFormatter<TEntity> {
  formatSummary(entity: TEntity): string;
  formatDetails(entity: TEntity): string[];
}

export interface EntityPrompter<TCreateDTO, TUpdateDTO> {
  promptCreate(): Promise<TCreateDTO>;
  promptUpdate(): Promise<TUpdateDTO>;
}
