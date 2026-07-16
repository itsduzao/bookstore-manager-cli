export interface Controller {
  list(): Promise<void>;
  create(): Promise<void>;
  update(): Promise<void>;
  delete(): Promise<void>;
  findById(): Promise<void>;
}
