import axios from "axios";
import queryString from "query-string";

const BASE_URL = "http://localhost:8080/api";

export interface ListQueuesResponse {
  queues: Queue[];
}

export interface ListActiveTasksResponse {
  tasks: ActiveTask[];
  stats: Queue;
}

export interface ListPendingTasksResponse {
  tasks: PendingTask[];
  stats: Queue;
}

export interface ListScheduledTasksResponse {
  tasks: ScheduledTask[];
  stats: Queue;
}

export interface ListRetryTasksResponse {
  tasks: RetryTask[];
  stats: Queue;
}

export interface ListDeadTasksResponse {
  tasks: DeadTask[];
  stats: Queue;
}

export interface ListSchedulerEntriesResponse {
  entries: SchedulerEntry[];
}

export interface ListSchedulerEnqueueEventsResponse {
  events: SchedulerEnqueueEvent[];
}

export interface BatchCancelTasksResponse {
  canceled_ids: string[];
  error_ids: string[];
}

export interface BatchDeleteTasksResponse {
  deleted_keys: string[];
  failed_keys: string[];
}

export interface BatchRunTasksResponse {
  pending_keys: string[];
  error_keys: string[];
}

export interface BatchKillTasksResponse {
  dead_keys: string[];
  error_keys: string[];
}

export interface ListQueueStatsResponse {
  stats: { [qname: string]: DailyStat[] };
}

export interface Queue {
  queue: string;
  paused: boolean;
  size: number;
  active: number;
  pending: number;
  scheduled: number;
  retry: number;
  dead: number;
  processed: number;
  failed: number;
  timestamp: string;
}

export interface DailyStat {
  queue: string;
  date: string;
  processed: number;
  failed: number;
}

// BaseTask corresponds to asynq.Task type.
interface BaseTask {
  type: string;
  payload: { [key: string]: any };
}

export interface ActiveTask extends BaseTask {
  id: string;
  queue: string;
}

export interface PendingTask extends BaseTask {
  id: string;
  queue: string;
}

export interface ScheduledTask extends BaseTask {
  id: string;
  key: string;
  queue: string;
  next_process_at: string;
}

export interface RetryTask extends BaseTask {
  id: string;
  key: string;
  queue: string;
  next_process_at: string;
  max_retry: number;
  retried: number;
  error_message: string;
}

export interface DeadTask extends BaseTask {
  id: string;
  key: string;
  queue: string;
  max_retry: number;
  retried: number;
  last_failed_at: string;
  error_message: string;
}

export interface SchedulerEntry {
  id: string;
  spec: string;
  task_type: string;
  task_payload: { [key: string]: any };
  options: string[];
  next_enqueue_at: string;
  // prev_enqueue_at will be omitted
  // if there were no previous enqueue events.
  prev_enqueue_at?: string;
}

export interface SchedulerEnqueueEvent {
  task_id: string;
  enqueued_at: string;
}

export interface PaginationOptions extends Record<string, number | undefined> {
  size?: number; // size of the page
  page?: number; // page number (1 being the first page)
}

export async function listQueues(): Promise<ListQueuesResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues`,
  });
  return resp.data;
}

export async function deleteQueue(qname: string): Promise<void> {
  await axios({
    method: "delete",
    url: `${BASE_URL}/queues/${qname}`,
  });
}

export async function pauseQueue(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}:pause`,
  });
}

export async function resumeQueue(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}:resume`,
  });
}

export async function listQueueStats(): Promise<ListQueueStatsResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queue_stats`,
  });
  return resp.data;
}

export async function listActiveTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListActiveTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/active_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function cancelActiveTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/active_tasks/${taskId}:cancel`,
  });
}

export async function cancelAllActiveTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/active_tasks:cancel_all`,
  });
}

export async function batchCancelActiveTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchCancelTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/active_tasks:batch_cancel`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function listPendingTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListPendingTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/pending_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listScheduledTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListScheduledTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/scheduled_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listRetryTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListRetryTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/retry_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listDeadTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListDeadTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/dead_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function runScheduledTask(
  qname: string,
  taskKey: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks/${taskKey}:run`,
  });
}

export async function killScheduledTask(
  qname: string,
  taskKey: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks/${taskKey}:kill`,
  });
}

export async function deleteScheduledTask(
  qname: string,
  taskKey: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks/${taskKey}`,
  });
}

export async function batchDeleteScheduledTasks(
  qname: string,
  taskKeys: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks:batch_delete`,
    data: {
      task_keys: taskKeys,
    },
  });
  return resp.data;
}

export async function deleteAllScheduledTasks(qname: string): Promise<void> {
  await axios({
    method: "delete",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks:delete_all`,
  });
}

export async function batchRunScheduledTasks(
  qname: string,
  taskKeys: string[]
): Promise<BatchRunTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks:batch_run`,
    data: {
      task_keys: taskKeys,
    },
  });
  return resp.data;
}

export async function runAllScheduledTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks:run_all`,
  });
}

export async function batchKillScheduledTasks(
  qname: string,
  taskKeys: string[]
): Promise<BatchKillTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks:batch_kill`,
    data: {
      task_keys: taskKeys,
    },
  });
  return resp.data;
}

export async function killAllScheduledTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks:kill_all`,
  });
}

export async function runRetryTask(
  qname: string,
  taskKey: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/retry_tasks/${taskKey}:run`,
  });
}

export async function killRetryTask(
  qname: string,
  taskKey: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/retry_tasks/${taskKey}:kill`,
  });
}

export async function deleteRetryTask(
  qname: string,
  taskKey: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${BASE_URL}/queues/${qname}/retry_tasks/${taskKey}`,
  });
}

export async function batchDeleteRetryTasks(
  qname: string,
  taskKeys: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/retry_tasks:batch_delete`,
    data: {
      task_keys: taskKeys,
    },
  });
  return resp.data;
}

export async function deleteAllRetryTasks(qname: string): Promise<void> {
  await axios({
    method: "delete",
    url: `${BASE_URL}/queues/${qname}/retry_tasks:delete_all`,
  });
}

export async function batchRunRetryTasks(
  qname: string,
  taskKeys: string[]
): Promise<BatchRunTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/retry_tasks:batch_run`,
    data: {
      task_keys: taskKeys,
    },
  });
  return resp.data;
}

export async function runAllRetryTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/retry_tasks:run_all`,
  });
}

export async function batchKillRetryTasks(
  qname: string,
  taskKeys: string[]
): Promise<BatchKillTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/retry_tasks:batch_kill`,
    data: {
      task_keys: taskKeys,
    },
  });
  return resp.data;
}

export async function killAllRetryTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/retry_tasks:kill_all`,
  });
}

export async function runDeadTask(
  qname: string,
  taskKey: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/dead_tasks/${taskKey}:run`,
  });
}

export async function deleteDeadTask(
  qname: string,
  taskKey: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${BASE_URL}/queues/${qname}/dead_tasks/${taskKey}`,
  });
}

export async function batchDeleteDeadTasks(
  qname: string,
  taskKeys: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/dead_tasks:batch_delete`,
    data: {
      task_keys: taskKeys,
    },
  });
  return resp.data;
}

export async function deleteAllDeadTasks(qname: string): Promise<void> {
  await axios({
    method: "delete",
    url: `${BASE_URL}/queues/${qname}/dead_tasks:delete_all`,
  });
}

export async function batchRunDeadTasks(
  qname: string,
  taskKeys: string[]
): Promise<BatchRunTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/dead_tasks:batch_run`,
    data: {
      task_keys: taskKeys,
    },
  });
  return resp.data;
}

export async function runAllDeadTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/dead_tasks:run_all`,
  });
}

export async function listSchedulerEntries(): Promise<ListSchedulerEntriesResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/scheduler_entries`,
  });
  return resp.data;
}

export async function listSchedulerEnqueueEvents(
  entryId: string
): Promise<ListSchedulerEnqueueEventsResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/scheduler_entries/${entryId}/enqueue_events`,
  });
  return resp.data;
}
