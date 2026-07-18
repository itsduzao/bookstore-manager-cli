export interface Emprestimo {
  id: number;
  dataEmprestimo: Date;
  dataVencimento: Date;
  dataDevolucao: Date,
  clienteId: number;
  livroId: number;
}