import { CliIO } from "../cli/IO/types";
import { UiPresenter } from "../cli/presenters/types";
import { Service } from "../services/types";
import { presentControllerError } from "./support/errorPresenter";
import { EntityFormatter, EntityPrompter } from "./support/types";
import { Controller } from "./types";

export class CrudController<TEntity, TCreateDTO, TUpdateDTO = Partial<TCreateDTO>, TId = number>
  implements Controller {

  constructor(
    private readonly service: Service<TEntity, TCreateDTO, TUpdateDTO, TId>,
    private readonly io: CliIO,
    private readonly presenter: UiPresenter,
    private readonly formatter: EntityFormatter<TEntity>,
    private readonly prompter: EntityPrompter<TCreateDTO, TUpdateDTO>,
    private readonly entityName: string
  ) { }

  async list(): Promise<void> {
    try {
      const entities = await this.service.list();

      if (entities.length === 0) {
        this.presenter.showInfo(`Nenhum(a) ${this.entityName} cadastrado(a) até o momento.`);
        return;
      }

      this.presenter.showList(entities.map(entity => this.formatter.formatSummary(entity)));
      this.presenter.showSuccess(`${entities.length} registro(s) encontrado(s).`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async create(): Promise<void> {
    try {
      const dto = await this.prompter.promptCreate();
      const entity = await this.service.create(dto);

      this.presenter.showList(this.formatter.formatDetails(entity));
      this.presenter.showSuccess(`${this.capitalizedEntityName()} cadastrado(a) com sucesso.`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async update(): Promise<void> {
    try {
      const id = await this.askId();
      const existingEntity = await this.loadEntityOrWarn(id);

      if (!existingEntity) return;

      const dto = await this.prompter.promptUpdate();
      const entity = await this.service.update(id, dto);

      this.presenter.showList(this.formatter.formatDetails(entity));
      this.presenter.showSuccess(`${this.capitalizedEntityName()} atualizado(a) com sucesso.`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async delete(): Promise<void> {
    try {
      const id = await this.askId();
      const existingEntity = await this.loadEntityOrWarn(id);

      if (!existingEntity) return;

      const confirmed = await this.io.askYesNo(`Tem certeza que deseja remover o(a) ${this.entityName} #${id}?`);

      if (!confirmed) {
        this.presenter.showInfo("Operação cancelada.");
        return;
      }

      await this.service.delete(id);
      this.presenter.showSuccess(`${this.capitalizedEntityName()} removido(a) com sucesso.`);
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }

  async findById(): Promise<void> {
    try {
      const id = await this.askId();
      const existingEntity = await this.loadEntityOrWarn(id);

      if (!existingEntity) return;

      this.presenter.showList(this.formatter.formatDetails(existingEntity));
    } catch (error) {
      presentControllerError(error, this.presenter);
    }
  }
  private async loadEntityOrWarn(id: TId): Promise<TEntity | null> {
    const entity = await this.service.findById(id);

    if (!entity) {
      this.presenter.showInfo(`Nenhum(a) ${this.entityName} encontrado(a) com o id ${id}.`);
      return null;
    }

    return entity;
  }

  private async askId(): Promise<TId> {
    const id = await this.io.askInt(`Informe o id do(a) ${this.entityName}: `, { min: 1 });
    return id as unknown as TId;
  }

  private capitalizedEntityName(): string {
    return this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1);
  }
}