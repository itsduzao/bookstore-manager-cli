import { CliIO } from "../cli/IO/types";
import { MenuLoopRunner } from "../cli/menu-loop.types";
import { UiPresenter } from "../cli/presenters/types";
import { Pool } from "pg";

export interface FeatureFactoryContext {
  pool: Pool;
  io: CliIO;
  presenter: UiPresenter;
  menuLoop: MenuLoopRunner;
}

export type Feature<TMenu, TService> = {
  menu: TMenu;
  service: TService;
};
