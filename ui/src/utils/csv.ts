import { TaskInfo } from "../api";
import { TaskState } from "../types/taskState";

function escapeCSVValue(value: string | number | boolean | undefined | null): string {
  const raw = value === undefined || value === null ? "" : String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function headersForState(state: TaskState): string[] {
  const base = [
    "id",
    "type",
    "payload",
    "queue",
    "max_retry",
    "retried",
    "error_message",
  ];
  switch (state) {
    case "active":
      return [...base, "start_time", "deadline", "is_orphaned"];
    case "pending":
    case "aggregating":
      return base;
    case "scheduled":
    case "retry":
      return [...base, "next_process_at"];
    case "archived":
      return [...base, "last_failed_at"];
    case "completed":
      return [...base, "completed_at", "result", "ttl_seconds"];
    default:
      return base;
  }
}

function rowForTask(state: TaskState, task: TaskInfo): string[] {
  const base = [
    task.id,
    task.type,
    task.payload,
    task.queue,
    task.max_retry,
    task.retried,
    task.error_message,
  ];
  switch (state) {
    case "active":
      return [
        ...base,
        task.start_time,
        task.deadline,
        task.is_orphaned,
      ].map(escapeCSVValue);
    case "pending":
    case "aggregating":
      return base.map(escapeCSVValue);
    case "scheduled":
    case "retry":
      return [...base, task.next_process_at].map(escapeCSVValue);
    case "archived":
      return [...base, task.last_failed_at].map(escapeCSVValue);
    case "completed":
      return [
        ...base,
        task.completed_at,
        task.result,
        task.ttl_seconds,
      ].map(escapeCSVValue);
    default:
      return base.map(escapeCSVValue);
  }
}

export function buildTasksCSV(state: TaskState, tasks: TaskInfo[]): string {
  const header = headersForState(state).join(",");
  const rows = tasks.map((task) => rowForTask(state, task).join(","));
  return [header, ...rows].join("\n");
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTasksCSV(
  queue: string,
  state: TaskState,
  tasks: TaskInfo[]
): void {
  const csv = buildTasksCSV(state, tasks);
  downloadCSV(`${queue}-${state}.csv`, csv);
}
