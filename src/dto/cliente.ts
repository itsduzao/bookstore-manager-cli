import { Cliente } from "../models/cliente";


export type ClienteCreateDTO = Omit<Cliente, "id">;
export type ClienteUpdateDTO = Partial<ClienteCreateDTO>;
export type ClienteFilterDTO = Partial<ClienteCreateDTO>;