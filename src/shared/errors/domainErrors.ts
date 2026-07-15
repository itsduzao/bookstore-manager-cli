export class EmptyPayloadError extends Error {
  constructor(action: string) {
    super(`Não é possível ${action} sem dados.`);
    this.name = "EmptyPayloadError";
  }
}

export class EntityNotFoundError extends Error {
  constructor(entityName: string, id: number | string) {
    super(`${entityName} com id ${id} não foi encontrado(a).`);
    this.name = "EntityNotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}