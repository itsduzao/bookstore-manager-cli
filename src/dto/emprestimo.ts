import { Emprestimo } from "../models/emprestimo";

export type EmprestimoCreateDTO = Omit<Emprestimo, "id">;
export type EmprestimoUpdateDTO = Partial<EmprestimoCreateDTO>;
export type EmprestimoFilterDTO = Partial<EmprestimoCreateDTO>;