import { CliIO } from "../../cli/IO/types";
import { ClienteCreateDTO, ClienteFilterDTO, ClienteUpdateDTO } from "../../dto/cliente";
import { Cliente } from "../../models/cliente";
import { EntityFormatter, EntityPrompter } from "./types";

export class ClienteFormatter implements EntityFormatter<Cliente> {
  formatSummary(cliente: Cliente): string {
    return `#${cliente.id} - ${cliente.nome} | ${cliente.email}`;
  }

  formatDetails(cliente: Cliente): string[] {
    return [
      `ID: ${cliente.id}`,
      `Nome: ${cliente.nome}`,
      `Email: ${cliente.email}`
    ];
  }
}

export class ClientePrompter implements EntityPrompter<ClienteCreateDTO, ClienteUpdateDTO> {
  constructor(private readonly io: CliIO) { }

  async promptCreate(): Promise<ClienteCreateDTO> {
    return this.promptRequiredFields();
  }

  async promptFilter(): Promise<ClienteFilterDTO> {
    console.log("--- Informe os dados para busca ---")
    return this.promptRequiredFields();
  }

  async promptUpdate(): Promise<ClienteUpdateDTO> {
    const dto: ClienteUpdateDTO = {};

    if (await this.io.askYesNo("Deseja alterar o nome?")) {
      dto.nome = await this.io.ask("Novo nome: ");
    }

    if (await this.io.askYesNo("Deseja alterar a nacionalidade?")) {
      dto.email = await this.io.ask("Novo email: ");
    }

    return dto;
  }

  private async promptRequiredFields(): Promise<ClienteCreateDTO> {
    const nome = await this.io.ask("Nome do cliente: ");
    const email = await this.io.ask("Email: ");

    return { nome, email };
  }
}
