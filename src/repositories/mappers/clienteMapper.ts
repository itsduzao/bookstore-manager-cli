import { ClienteCreateDTO, ClienteFilterDTO, ClienteUpdateDTO } from "../../dto/cliente";
import { Cliente } from "../../models/cliente";
import { EntityMapper, FilterMapper } from "./types";

export type ClienteRow = {
  id: number;
  nome: string;
  email: string;
}

export type ClienteCreateRow = Omit<ClienteRow, "id">;
export type ClienteOptionalRow = Partial<ClienteRow>

class ClienteMapper
  implements
  EntityMapper<Cliente, ClienteCreateDTO, ClienteUpdateDTO>,
  FilterMapper<ClienteUpdateDTO> {

  mapRowToEntity(row: ClienteRow): Cliente {
    return {
      id: row.id,
      nome: row.nome,
      email: row.email
    }
  }

  private mapDtoToRow(dto: Partial<ClienteCreateDTO>): ClienteOptionalRow {
    const clienteRow: ClienteOptionalRow = {};

    if (dto.nome !== undefined) clienteRow.nome = dto.nome
    if (dto.email !== undefined) clienteRow.email = dto.email

    return clienteRow;
  }

  mapCreateDtoToRow(dto: ClienteCreateDTO): ClienteCreateRow {
    return this.mapDtoToRow(dto) as ClienteCreateRow;
  }

  mapUpdateDtoToRow(dto: ClienteUpdateDTO): ClienteOptionalRow {
    return this.mapDtoToRow(dto);
  }

  mapFilterDtoToRow(dto: ClienteFilterDTO): ClienteOptionalRow {
    return this.mapDtoToRow(dto);
  }
}

export const clienteMapper = new ClienteMapper();