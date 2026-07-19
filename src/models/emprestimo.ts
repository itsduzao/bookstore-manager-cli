export interface Emprestimo {
  id: number;
  dataEmprestimo: Date;
  dataVencimento: Date;
  dataDevolucao: Date | null;
  clienteId: number;
  livroId: number;
}