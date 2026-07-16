import { Book } from "../models/livro";

export type BookCreateDTO = Omit<Book, "id">;
export type BookUpdateDTO = Partial<BookCreateDTO>;
export type BookFilterDTO = BookCreateDTO;