import { UiPresenter } from "../../cli/presenters/types";
import { EmptyPayloadError, EntityNotFoundError, ValidationError } from "../../shared/errors/domainErrors";

const CONNECTION_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "57P01",
]);

export function presentControllerError(error: unknown, presenter: UiPresenter): void {
  if (error instanceof ValidationError || error instanceof EmptyPayloadError || error instanceof EntityNotFoundError) {
    presenter.showWarning(error.message);
    return;
  }

  if (isDatabaseError(error)) {
    presenter.showError(databaseErrorMessage(error.code));
    return;
  }

  const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
  presenter.showError(message);
}

type DatabaseDriverError = Error & { code?: unknown };

function isDatabaseError(error: unknown): error is DatabaseDriverError {
  return error instanceof Error && typeof (error as DatabaseDriverError).code === "string";
}

function databaseErrorMessage(code: unknown): string {
  if (code === "23505") {
    return "Já existe um cliente cadastrado com este e-mail.";
  }

  if (typeof code === "string" && (code.startsWith("08") || CONNECTION_ERROR_CODES.has(code))) {
    return "Não foi possível conectar ao banco de dados. Verifique a conexão e tente novamente.";
  }

  return "Não foi possível concluir a operação no banco de dados. Tente novamente.";
}
