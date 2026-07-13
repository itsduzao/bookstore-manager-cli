import { stdin as input, stdout as output } from "node:process";
import { createInterface, Interface } from "node:readline/promises";
import { formatFeedback } from "../feedback";
import { AskIntOptions } from "../types";
import { CliIO } from "./types";

export class CLIReadLine implements CliIO {
  private readonly readline: Interface;

  constructor() {
    this.readline = createInterface({ input, output });
  }

  async ask(question: string): Promise<string> {
    const answer = await this.readline.question(question);
    return answer.trim();
  }

  async askInt(question: string, options?: AskIntOptions): Promise<number> {
    while (true) {
      const raw = await this.ask(question);
      const value = Number(raw);
      const { min, max } = options ?? {};

      if (!Number.isInteger(value)) {
        console.log(formatFeedback("warning", "Digite um número inteiro válido."));
        continue;
      }

      if (min !== undefined && value < min) {
        console.log(formatFeedback("warning", `O valor deve ser >= ${min}.`));
        continue;
      }

      if (max !== undefined && value > max) {
        console.log(formatFeedback("warning", `O valor deve ser <= ${max}.`));
        continue;
      }

      return value;
    }
  }

  async askWithOptions(question: string, options: string[]): Promise<string> {
    if (options.length === 0) {
      throw new Error("askWithOptions requer ao menos uma opção.");
    }

    const allowed = new Set(options);

    while (true) {
      const answer = await this.ask(question);

      if (allowed.has(answer)) {
        return answer;
      }

      console.log(formatFeedback("warning", `Opção inválida. Use uma das opções: ${options.join(", ")}.`));
    }
  }

  async askYesNo(question: string): Promise<boolean> {
    while (true) {
      const answer = (await this.ask(`${question} (S/N): `)).toLowerCase();

      if (answer === "s") return true;
      if (answer === "n") return false;

      console.log(formatFeedback("warning", "Responda com S ou N."));
    }
  }

  close(): void {
    this.readline.close();
  }
}