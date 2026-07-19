import { Emprestimo } from "../models/emprestimo";

export type EmprestimoRecordDTO = Omit<Emprestimo, "id">;
export type EmprestimoCreateDTO = {
  clienteId: number;
  livroId: number;
};
export type EmprestimoUpdateDTO = Partial<EmprestimoRecordDTO>;
export type EmprestimoFilterDTO = Partial<EmprestimoRecordDTO>;