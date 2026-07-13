import { stdin as input, stdout as output } from "process";
import { createInterface, Interface } from "readline/promises";
import { CliIO, IO } from "./types";

class Readline implements IO {
  private readonly readline: Interface;

  constructor() {
    this.readline = createInterface({ input, output })
  }

  async ask(question: string): Promise<string> {
    const answer = await this.readline.question(question);
    return answer.trim();
  }

  write(message: string): void {
    this.readline.write(message);
  }

  close(): void {
    this.readline.close();
  }
}

class CliReadline extends Readline implements CliIO {
  async ask(question: string, optional = false): Promise<string> {
    if (optional) {
      const answer = await super.ask(question);
      return answer
    }

    while (true) {
      const answer = await super.ask(question);

      if (answer.length > 0) return answer

      this.write("[ERRO] Digite algum valor.")
      continue
    }
  }

  async askInt(question: string, options?: { min?: number, max?: number }): Promise<number> {
    while (true) {
      const raw = await this.ask(question);
      const value = Number(raw);
      const { min, max } = options ?? {}

      if (!Number.isInteger(value)) {
        this.write("[ERRO] Digite um número inteiro válido.");
        continue;
      }

      if (min !== undefined && value < min) {
        this.write(`[ERRO] O valor deve ser >= ${min}.`);
        continue;
      }

      if (max !== undefined && value > max) {
        this.write(`[ERRO] O valor deve ser <= ${max}.`);
        continue;
      }

      return value;
    }
  }

  async askYesNo(question: string): Promise<boolean> {
    while (true) {
      const answer = (await this.ask(`${question} (S/N): `)).toLowerCase();

      if (answer === "s") return true;
      if (answer === "n") return false;

      this.write("[ERRO] Responda com S ou N.")
    }
  }

  async askWithOptions(question: string, options: string[]): Promise<string> {
    while (true) {
      const answer = await this.ask(question)
    }
  }
}