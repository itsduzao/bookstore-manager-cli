import { formatFeedback } from "../feedback";
import { MenuOption } from "../types";
import { UiPresenter } from "./types";

export class ConsolePresenter implements UiPresenter {
  showHeader(title: string): void {
    console.log(`\n=== ${title} ===`);
  }

  showMenu(title: string, options: MenuOption[]): void {
    this.showHeader(title);
    console.log("");

    for (const option of options) {
      console.log(`${option.key} - ${option.label}`);
    }

    console.log("");
  }

  showSuccess(message: string): void {
    this.showFeedback("success", message);
  }

  showError(message: string): void {
    this.showFeedback("error", message);
  }

  showWarning(message: string): void {
    this.showFeedback("warning", message);
  }

  showInfo(message: string): void {
    this.showFeedback("info", message);
  }

  showList(lines: string[]): void {
    console.log("");

    for (const line of lines) {
      console.log(line);
    }

    console.log("");
  }

  private showFeedback(level: "success" | "info" | "warning" | "error", message: string): void {
    console.log(`\n${formatFeedback(level, message)}\n`);
  }
}
