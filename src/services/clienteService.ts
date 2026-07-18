import { ClienteCreateDTO, ClienteFilterDTO, ClienteUpdateDTO } from "../dto/cliente";
import { Cliente } from "../models/cliente";
import { ClienteRepository } from "../repositories/clienteRepository";
import { ValidationError } from "../shared/errors/domainErrors";
import { CrudService } from "./crudService";
import { Service } from "./types";

export interface ClienteService extends Service<Cliente, ClienteCreateDTO, ClienteUpdateDTO, number> {
  findByName(name: string): Promise<Cliente[] | null>;
  findByData(dto: ClienteFilterDTO): Promise<Cliente | null>;
}

export class DefaultClienteService implements ClienteService {
  private readonly crudService: Service<Cliente, ClienteCreateDTO, ClienteUpdateDTO, number>;

  constructor(private readonly repository: ClienteRepository) {
    this.crudService = new CrudService(repository);
  }

  list(): Promise<Cliente[]> {
    return this.crudService.list();
  }

  create(dto: ClienteCreateDTO): Promise<Cliente> {
    this.validate(dto);
    return this.crudService.create(dto);
  }

  update(id: number, dto: ClienteUpdateDTO): Promise<Cliente> {
    this.validate(dto);
    return this.crudService.update(id, dto);
  }

  delete(id: number): Promise<void> {
    return this.crudService.delete(id);
  }

  findById(id: number): Promise<Cliente | null> {
    return this.crudService.findById(id);
  }

  findByName(name: string): Promise<Cliente[] | null> {
    return this.repository.findByName(name);
  }

  findByData(dto: ClienteFilterDTO): Promise<Cliente | null> {
    return this.repository.findByData(dto);
  }

  private validate(dto: ClienteCreateDTO | ClienteUpdateDTO): void {
    if (dto.nome !== undefined && dto.nome.trim().length === 0) {
      throw new ValidationError("O nome do cliente não pode ser vazio.");
    }

    if (dto.email !== undefined) {
      const emailTrimmed = dto.email.trim();

      if (emailTrimmed.length === 0) {
        throw new ValidationError("O e-mail do cliente não pode ser vazio.");
      }

      if (!emailTrimmed.includes("@") || !emailTrimmed.includes(".")) {
        throw new ValidationError("O e-mail informado é inválido.");
      }
    }
  }
}
