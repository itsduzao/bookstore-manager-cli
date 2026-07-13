import { MenuOption } from "../types";

export interface UiPresenter {
  showHeader(title: string): void;
  showMenu(title: string, options: MenuOption[]): void;
  showSuccess(message: string): void;
  showError(message: string): void;
  showWarning(message: string): void;
  showInfo(message: string): void;
}