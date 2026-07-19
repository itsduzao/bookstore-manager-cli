import { EmprestimoRecordDTO, EmprestimoUpdateDTO } from "../../dto/emprestimo";
import { Emprestimo } from "../../models/emprestimo";
import { EntityMapper } from "./types";

export type EmprestimoRow = {
  id: number;
  data_emprestimo: Date;
  data_vencimento: Date;
  data_devolucao: Date | null;
  cliente_id: number;
  livro_id: number;
};

export type EmprestimoCreateRow = Omit<EmprestimoRow, "id">;
export type EmprestimoOptionalRow = Partial<EmprestimoRow>;

class EmprestimoMapper implements EntityMapper<Emprestimo, EmprestimoRecordDTO, EmprestimoUpdateDTO> {

  mapRowToEntity(row: EmprestimoRow): Emprestimo {
    return {
      id: row.id,
      dataEmprestimo: row.data_emprestimo,
      dataVencimento: row.data_vencimento,
      dataDevolucao: row.data_devolucao,
      clienteId: row.cliente_id,
      livroId: row.livro_id,
    };
  }

  private mapDtoToRow(dto: Partial<EmprestimoRecordDTO>): EmprestimoOptionalRow {
    const row: EmprestimoOptionalRow = {};

    if (dto.dataEmprestimo !== undefined) row.data_emprestimo = dto.dataEmprestimo;
    if (dto.dataVencimento !== undefined) row.data_vencimento = dto.dataVencimento;
    if (dto.dataDevolucao !== undefined) row.data_devolucao = dto.dataDevolucao;
    if (dto.clienteId !== undefined) row.cliente_id = dto.clienteId;
    if (dto.livroId !== undefined) row.livro_id = dto.livroId;

    return row;
  }

  mapCreateDtoToRow(dto: EmprestimoRecordDTO): EmprestimoCreateRow {
    return this.mapDtoToRow(dto) as EmprestimoCreateRow;
  }

  mapUpdateDtoToRow(dto: EmprestimoUpdateDTO): EmprestimoOptionalRow {
    return this.mapDtoToRow(dto);
  }
}

export const emprestimoMapper = new EmprestimoMapper();
