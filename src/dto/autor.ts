import { Autor } from "../models/autor";

export type AutorDTO = Omit<Autor, "id"> 