export type TaskState =
  | "active"
  | "pending"
  | "aggregating"
  | "scheduled"
  | "retry"
  | "archived"
  | "completed";
