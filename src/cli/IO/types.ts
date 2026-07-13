import { AskIntOptions } from "../types";

export interface CliIO {
  ask(question: string): Promise<string>;
  askInt(question: string, options?: AskIntOptions): Promise<number>;
  askWithOptions(question: string, options: string[]): Promise<string>;
  askYesNo(question: string): Promise<boolean>;
  close(): void;
}