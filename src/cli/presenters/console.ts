import { MenuOption } from "../types";
import { UiPresenter } from "./types";

export class ConsolePresenter implements UiPresenter {
  showHeader(title: string): void {
    console.log(`\n=== ${title} ===`);
  }

  showMenu(title: string, options: MenuOption[]): void {
    this.showHeader(title);

    for (const option of options) {
      console.log(`${option.key} - ${option.label}`);
    }
  }

  showSuccess(message: string): void {
    console.log(`\n[SUCESSO] ${message}`);
  }

  showError(message: string): void {
    console.log(`\n[ERRO] ${message}`);
  }

  showInfo(message: string): void {
    console.log(`\n[INFO] ${message}`);
  }
}