import { CliIO } from "../../cli/IO/types";
import { AutorCreateDTO, AutorFilterDTO, AutorUpdateDTO } from "../../dto/autor";
import { Autor } from "../../models/autor";
import { MIN_AUTOR_BIRTH_YEAR } from "../../shared/constants/validation";
import { EntityFormatter, EntityPrompter } from "./types";

export class AutorFormatter implements EntityFormatter<Autor> {
  formatSummary(autor: Autor): string {
    return `#${autor.id} - ${autor.nome} (${autor.nacionalidade}, ${autor.anoNascimento})`;
  }

  formatDetails(autor: Autor): string[] {
    return [
      `ID: ${autor.id}`,
      `Nome: ${autor.nome}`,
      `Ano de nascimento: ${autor.anoNascimento}`,
      `Nacionalidade: ${autor.nacionalidade}`,
    ];
  }
}

export class AutorPrompter implements EntityPrompter<AutorCreateDTO, AutorUpdateDTO> {
  constructor(private readonly io: CliIO) { }

  async promptCreate(): Promise<AutorCreateDTO> {
    return this.promptRequiredFields();
  }

  async promptFilter(): Promise<AutorFilterDTO> {
    console.log("--- Informe os dados para busca ---")
    return this.promptRequiredFields();
  }

  async promptUpdate(): Promise<AutorUpdateDTO> {
    const dto: AutorUpdateDTO = {};

    if (await this.io.askYesNo("Deseja alterar o nome?")) {
      dto.nome = await this.io.ask("Novo nome: ");
    }

    if (await this.io.askYesNo("Deseja alterar o ano de nascimento?")) {
      dto.anoNascimento = await this.askBirthYear();
    }

    if (await this.io.askYesNo("Deseja alterar a nacionalidade?")) {
      dto.nacionalidade = await this.io.ask("Nova nacionalidade: ");
    }

    return dto;
  }

  private async promptRequiredFields(): Promise<AutorCreateDTO> {
    const nome = await this.io.ask("Nome do autor: ");
    const anoNascimento = await this.askBirthYear();
    const nacionalidade = await this.io.ask("Nacionalidade: ");

    return { nome, anoNascimento, nacionalidade };
  }

  private askBirthYear(): Promise<number> {
    return this.io.askInt("Ano de nascimento: ", {
      min: MIN_AUTOR_BIRTH_YEAR,
      max: new Date().getFullYear(),
    });
  }
}
