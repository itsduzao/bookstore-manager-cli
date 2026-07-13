import { MenuOption } from "./types";

export type MenuAction = {
  key: string;
  handler: () => Promise<void> | void;
};

export type MenuDefinition = {
  title: string;
  options: MenuOption[];
  actions: MenuAction[];
};

export interface MenuLoopRunner {
  run(definition: MenuDefinition): Promise<void>;
}