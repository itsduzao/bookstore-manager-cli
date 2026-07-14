import { Autor } from "../models/autor";

export type AutorCreateDTO = Omit<Autor, "id">;
export type AutorUpdateDTO = Partial<Omit<Autor, "id">>;
export type AutorLookUpDTO = AutorCreateDTO;