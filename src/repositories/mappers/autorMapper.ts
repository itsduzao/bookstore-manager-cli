import { AutorCreateDTO, AutorFilterDTO, AutorUpdateDTO } from "../../dto/autor";
import { Autor } from "../../models/autor";
import { EntityMapper, FilterMapper } from "./types";

export type AutorRow = {
  id: number;
  nome: string;
  ano_nascimento: number;
  nacionalidade: string;
};

export type AutorCreateRow = Omit<AutorRow, "id">
export type AutorOptionalRow = Partial<AutorRow>

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

  private mapDtoToRow(dto: Partial<AutorCreateDTO>): AutorOptionalRow {
    const row: AutorOptionalRow = {};

    if (dto.nome !== undefined) row.nome = dto.nome;
    if (dto.anoNascimento !== undefined) row.ano_nascimento = dto.anoNascimento;
    if (dto.nacionalidade !== undefined) row.nacionalidade = dto.nacionalidade;

    return row;
  }

  mapCreateDtoToRow(dto: AutorCreateDTO): AutorCreateRow {
    return this.mapDtoToRow(dto) as AutorCreateRow;
  }

  mapUpdateDtoToRow(dto: AutorUpdateDTO): AutorOptionalRow {
    return this.mapDtoToRow(dto);
  }

  mapFilterDtoToRow(dto: AutorFilterDTO): AutorRow {
    return this.mapDtoToRow(dto) as AutorRow;
  }
}

export const autorMapper = new AutorMapper();