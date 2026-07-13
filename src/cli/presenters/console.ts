import { formatFeedback } from "../feedback";
import { MenuOption } from "../types";
import { UiPresenter } from "./types";

export class ConsolePresenter implements UiPresenter {
  private pendingFeedback: { level: "success" | "info" | "warning" | "error"; message: string } | null = null;

  showHeader(title: string): void {
    console.log(`\n=== ${title} ===`);
  }

  showMenu(title: string, options: MenuOption[]): void {
    this.showHeader(title);

    if (this.pendingFeedback) {
      console.log(formatFeedback(this.pendingFeedback.level, this.pendingFeedback.message));
      console.log("");
      this.pendingFeedback = null;
    }

    for (const option of options) {
      console.log(`${option.key} - ${option.label}`);
    }
  }

  showSuccess(message: string): void {
    this.pendingFeedback = { level: "success", message };
  }

  showError(message: string): void {
    this.pendingFeedback = { level: "error", message };
  }

  showWarning(message: string): void {
    this.pendingFeedback = { level: "warning", message };
  }

  showInfo(message: string): void {
    this.pendingFeedback = { level: "info", message };
  }
}