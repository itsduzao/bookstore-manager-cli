import { Autor } from "../models/autor";

export type AutorCreateDTO = Omit<Autor, "id">;
export type AutorUpdateDTO = Partial<AutorCreateDTO>;
export type AutorFilterDTO = Partial<AutorCreateDTO>;