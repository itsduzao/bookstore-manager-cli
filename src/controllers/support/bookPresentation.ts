import { CliIO } from "../../cli/IO/types";
import { BookCreateDTO, BookFilterDTO, BookUpdateDTO } from "../../dto/livro";
import { Book } from "../../models/livro";
import { EntityFormatter, EntityPrompter } from "./types";

export class BookFormatter implements EntityFormatter<Book> {
  formatSummary(book: Book): string {
    return `#${book.id} - ${book.titulo} (${book.qtdDisponivel} unidades.)`;
  }

  formatDetails(book: Book): string[] {
    return [
      `ID: ${book.id}`,
      `Nome: ${book.titulo}`,
      `Quantidade: ${book.qtdDisponivel}`,
    ];
  }
}

export class BookPrompter implements EntityPrompter<BookCreateDTO, BookUpdateDTO> {
  constructor(private readonly io: CliIO) { }

  async promptCreate(): Promise<BookCreateDTO> {
    return this.promptRequiredFields();
  }

  async promptFilter(): Promise<BookFilterDTO> {
    console.log("--- Informe os dados para busca ---")
    return this.promptRequiredFields();
  }

  async promptUpdate(): Promise<BookUpdateDTO> {
    const dto: BookUpdateDTO = {};

    if (await this.io.askYesNo("Deseja alterar o titulo?")) {
      dto.titulo = await this.io.ask("Novo titulo: ");
    }

    if (await this.io.askYesNo("Deseja alterar a quantidade?")) {
      dto.qtdDisponivel = await this.io.askInt("Quantidade disponível: ");
    }

    return dto;
  }

  private async promptRequiredFields(): Promise<BookCreateDTO> {
    const titulo = await this.io.ask("Título: ");
    const qtdDisponivel = await this.io.askInt("Quantidade: ", { min: 1 });
    const autorId = await this.io.askInt("ID do autor: ", { min: 1 });

    return { titulo, qtdDisponivel, autorId };
  }
}
