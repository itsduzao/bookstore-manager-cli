import { UiPresenter } from "../../cli/presenters/types";
import { EmptyPayloadError, EntityNotFoundError, ValidationError } from "../../shared/errors/domainErrors";

export function presentControllerError(error: unknown, presenter: UiPresenter): void {
  if (error instanceof ValidationError || error instanceof EmptyPayloadError || error instanceof EntityNotFoundError) {
    presenter.showWarning(error.message);
    return;
  }

  const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
  presenter.showError(message);
}
