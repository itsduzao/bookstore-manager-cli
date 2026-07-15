import { AutorCreateDTO, AutorUpdateDTO } from "../../dto/autor";
import { Autor } from "../../models/autor";
import { EntityMapper, FilterMapper } from "./types";

export type AutorRow = {
  id: number;
  nome: string;
  ano_nascimento: number;
  nacionalidade: string;
};

// Definindo o tipo de busca de forma genérica usando Partial do CreateDTO
export type AutorFilterDTO = Partial<AutorCreateDTO>;

export class AutorMapper
  implements
  EntityMapper<Autor, AutorCreateDTO, AutorUpdateDTO>,
  FilterMapper<AutorFilterDTO> {

  mapRowToEntity(row: AutorRow): Autor {
    return {
      id: row.id,
      nome: row.nome,
      anoNascimento: row.ano_nascimento,
      nacionalidade: row.nacionalidade,
    };
  }

  private mapDtoToRow(dto: Partial<AutorCreateDTO>): Record<string, unknown> {
    const row: Record<string, unknown> = {};

    if (dto.nome !== undefined) row.nome = dto.nome;
    if (dto.anoNascimento !== undefined) row.ano_nascimento = dto.anoNascimento;
    if (dto.nacionalidade !== undefined) row.nacionalidade = dto.nacionalidade;

    return row;
  }

  mapCreateDtoToRow(dto: AutorCreateDTO): Record<string, unknown> {
    return this.mapDtoToRow(dto);
  }

  mapUpdateDtoToRow(dto: AutorUpdateDTO): Record<string, unknown> {
    return this.mapDtoToRow(dto);
  }

  mapFilterDtoToRow(dto: AutorFilterDTO): Record<string, unknown> {
    return this.mapDtoToRow(dto);
  }
}

export const autorMapper = new AutorMapper();