import { BookCreateDTO, BookFilterDTO, BookUpdateDTO } from "../../dto/livro";
import { Book } from "../../models/livro";
import { EntityMapper, FilterMapper } from "./types";

export type BookRow = {
  id: number;
  titulo: string;
  quantidade_disponivel: number;
  autor_id: number;
};

export type BookCreateRow = Omit<BookRow, "id">
export type BookOptionalRow = Partial<BookRow>

export class BookMapper
  implements
  EntityMapper<Book, BookCreateDTO, BookUpdateDTO>,
  FilterMapper<BookFilterDTO> {

  mapRowToEntity(row: BookRow): Book {
    return {
      id: row.id,
      titulo: row.titulo,
      qtdDisponivel: row.quantidade_disponivel,
      autorId: row.autor_id
    };
  }

  private mapDtoToRow(dto: Partial<BookCreateDTO>): BookOptionalRow {
    const row: BookOptionalRow = {};

    if (dto.titulo !== undefined) row.titulo = dto.titulo;
    if (dto.qtdDisponivel !== undefined) row.quantidade_disponivel = dto.qtdDisponivel;
    if (dto.autorId !== undefined) row.autor_id = dto.autorId;

    return row;
  }

  mapCreateDtoToRow(dto: BookCreateDTO): BookCreateRow {
    return this.mapDtoToRow(dto) as BookCreateRow;
  }

  mapUpdateDtoToRow(dto: BookUpdateDTO): BookOptionalRow {
    return this.mapDtoToRow(dto);
  }

  mapFilterDtoToRow(dto: BookFilterDTO): BookOptionalRow {
    return this.mapDtoToRow(dto);
  }
}

export const bookMapper = new BookMapper();