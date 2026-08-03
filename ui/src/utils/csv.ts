import { TaskInfo } from "../api";
import { TaskState } from "../types/taskState";

const COLUMNS: (keyof TaskInfo)[] = [
  "id",
  "type",
  "payload",
  "queue",
  "max_retry",
  "retried",
  "error_message",
  "start_time",
  "deadline",
  "is_orphaned",
  "next_process_at",
  "last_failed_at",
  "completed_at",
  "result",
  "ttl_seconds",
];

function escapeCSV(value: unknown): string {
  const raw = value == null ? "" : String(value);
  return /[",\n\r]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
}

export function downloadTasksCSV(
  queue: string,
  state: TaskState,
  tasks: TaskInfo[]
): void {
  const lines = [
    COLUMNS.join(","),
    ...tasks.map((task) => COLUMNS.map((col) => escapeCSV(task[col])).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${queue}-${state}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
