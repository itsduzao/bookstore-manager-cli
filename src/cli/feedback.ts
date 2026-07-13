export type FeedbackLevel = "success" | "info" | "warning" | "error";

const labels: Record<FeedbackLevel, string> = {
  success: "SUCESSO",
  info: "INFO",
  warning: "AVISO",
  error: "ERRO",
};

const colors: Record<FeedbackLevel, string> = {
  success: "\u001b[32m",
  info: "\u001b[36m",
  warning: "\u001b[33m",
  error: "\u001b[31m",
};

const resetColor = "\u001b[0m";

export function formatFeedback(level: FeedbackLevel, message: string): string {
  const formatted = `[${labels[level]}] ${message}`;

  if (!process.stdout.isTTY || process.env.NO_COLOR) {
    return formatted;
  }

  return `${colors[level]}${formatted}${resetColor}`;
}