import { AutorCreateDTO, AutorFilterDTO, AutorUpdateDTO } from "../dto/autor";
import { Autor } from "../models/autor";
import { AutorRepository } from "../repositories/autorRepository";
import { MIN_AUTOR_BIRTH_YEAR } from "../shared/constants/validation";
import { ValidationError } from "../shared/errors/domainErrors";
import { CrudService } from "./crudService";
import { Service } from "./types";

export interface AutorService extends Service<Autor, AutorCreateDTO, AutorUpdateDTO, number> {
  findByName(name: string): Promise<Autor[] | null>;
  findByData(dto: AutorFilterDTO): Promise<Autor | null>;
}

export class DefaultAutorService implements AutorService {
  private readonly crudService: Service<Autor, AutorCreateDTO, AutorUpdateDTO, number>;

  constructor(private readonly repository: AutorRepository) {
    this.crudService = new CrudService(repository);
  }

  list(): Promise<Autor[]> {
    return this.crudService.list();
  }

  create(dto: AutorCreateDTO): Promise<Autor> {
    this.validate(dto);
    return this.crudService.create(dto);
  }

  update(id: number, dto: AutorUpdateDTO): Promise<Autor> {
    this.validate(dto);
    return this.crudService.update(id, dto);
  }

  delete(id: number): Promise<void> {
    return this.crudService.delete(id);
  }

  findById(id: number): Promise<Autor | null> {
    return this.crudService.findById(id);
  }

  findByName(name: string): Promise<Autor[] | null> {
    return this.repository.findByName(name);
  }

  findByData(dto: AutorFilterDTO): Promise<Autor | null> {
    return this.repository.findByData(dto);
  }

  private validate(dto: AutorCreateDTO | AutorUpdateDTO): void {
    if (dto.nome !== undefined && dto.nome.trim().length === 0) {
      throw new ValidationError("O nome do autor não pode ser vazio.");
    }

    const currentYear = new Date().getFullYear();

    if (
      dto.anoNascimento !== undefined &&
      (dto.anoNascimento < MIN_AUTOR_BIRTH_YEAR || dto.anoNascimento > currentYear)
    ) {
      throw new ValidationError(
        `O ano de nascimento deve estar entre ${MIN_AUTOR_BIRTH_YEAR} e ${currentYear}.`
      );
    }
  }
}
