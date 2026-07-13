export interface IO {
  ask(question: string): Promise<string>;
  write(message: string): void;
  close(): void;
}

export interface CliIO {
  ask(question: string): Promise<string>;
  askInt(question: string, options?: { min?: number, max?: number }): Promise<number>;
  askWithOptions(question: string, options: string[]): Promise<string>;
  askYesNo(question: string): Promise<boolean>;
}