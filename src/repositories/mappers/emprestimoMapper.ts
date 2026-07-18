import { EmprestimoCreateDTO, EmprestimoFilterDTO, EmprestimoUpdateDTO } from "../../dto/emprestimo";
import { Emprestimo } from "../../models/emprestimo";
import { EntityMapper, FilterMapper } from "./types";

type EmprestimoRow = {
  id: number;
  data_emprestimo: Date;
  data_vencimento: Date;
  data_devolucao: Date,
  cliente_id: number;
  livro_id: number;
}

export type EmprestimoCreateRow = Omit<EmprestimoRow, "id">;
export type EmprestimoOptionalRow = Partial<EmprestimoRow>

class EmprestimoMapper
  implements
  EntityMapper<Emprestimo, EmprestimoCreateDTO, EmprestimoUpdateDTO>,
  FilterMapper<EmprestimoUpdateDTO> {

  mapRowToEntity(row: EmprestimoRow): Emprestimo {
    return {
      id: row.id,
      dataEmprestimo: row.data_emprestimo,
      dataVencimento: row.data_vencimento,
      dataDevolucao: row.data_devolucao,
      clienteId: row.cliente_id,
      livroId: row.livro_id
    }
  }

  private mapDtoToRow(dto: Partial<EmprestimoCreateDTO>): EmprestimoOptionalRow {
    const emprestimoRow: EmprestimoOptionalRow = {};


    return emprestimoRow;
  }

  mapCreateDtoToRow(dto: EmprestimoCreateDTO): EmprestimoCreateRow {
    return this.mapDtoToRow(dto) as EmprestimoCreateRow;
  }

  mapUpdateDtoToRow(dto: EmprestimoUpdateDTO): EmprestimoOptionalRow {
    return this.mapDtoToRow(dto);
  }

  mapFilterDtoToRow(dto: EmprestimoFilterDTO): EmprestimoOptionalRow {
    return this.mapDtoToRow(dto);
  }
}

export const emprestimoMapper = new EmprestimoMapper();