import axios from "axios";
import queryString from "query-string";

// In production build, API server is on listening on the same port as
// the static file server.
// In developement, we assume that the API server is listening on port 8080.
const getBaseUrl = () =>
  process.env.NODE_ENV === "production"
    ? `${window.ROOT_PATH}/api`
    : `http://localhost:8080${window.ROOT_PATH}/api`;

export interface ListQueuesResponse {
  queues: Queue[];
}

export interface ListTasksResponse {
  tasks: TaskInfo[];
  stats: Queue;
}

export interface ListAggregatingTasksResponse {
  tasks: TaskInfo[];
  stats: Queue;
  groups: GroupInfo[];
}

export interface ListServersResponse {
  servers: ServerInfo[];
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
  deleted_ids: string[];
  failed_ids: string[];
}

export interface BatchRunTasksResponse {
  pending_ids: string[];
  error_ids: string[];
}

export interface BatchArchiveTasksResponse {
  archived_ids: string[];
  error_ids: string[];
}

export interface DeleteAllTasksResponse {
  deleted: number;
}

export interface ArchiveAllTasksResponse {
  archived: number;
}

export interface RunAllTasksResponse {
  scheduled: number;
}

export interface ListQueueStatsResponse {
  stats: { [qname: string]: DailyStat[] };
}

export interface ListGroupsResponse {
  stats: Queue;
  groups: GroupInfo[];
}

export interface RedisInfoResponse {
  address: string;
  info: RedisInfo;
  raw_info: string;
  cluster: boolean;

  // following fields are set only when cluster=true
  raw_cluster_nodes: string;
  queue_locations: QueueLocation[] | null;
}

// Describes location of a queue in cluster.
export interface QueueLocation {
  queue: string; // queue name
  keyslot: number; // cluster keyslot
  nodes: string[]; // node addresses
}

export interface MetricsResponse {
  queue_size: PrometheusMetricsResponse;
  queue_latency_seconds: PrometheusMetricsResponse;
  queue_memory_usage_approx_bytes: PrometheusMetricsResponse;
  tasks_processed_per_second: PrometheusMetricsResponse;
  tasks_failed_per_second: PrometheusMetricsResponse;
  error_rate: PrometheusMetricsResponse;
  pending_tasks_by_queue: PrometheusMetricsResponse;
  retry_tasks_by_queue: PrometheusMetricsResponse;
  archived_tasks_by_queue: PrometheusMetricsResponse;
}

export interface PrometheusMetricsResponse {
  status: "success" | "error";
  data?: MetricsResult; // present if status === "success"
  error?: string; // present if status === "error"
  errorType?: string; // present if status === "error"
}

export interface MetricsResult {
  resultType: string;
  result: Metrics[];
}

export interface Metrics {
  metric: MetricsInfo;
  values: [number, string][]; // [unixtime, value]
}

export interface MetricsInfo {
  __name__: string;
  instance: string;
  job: string;

  // labels (may or may not be present depending on metrics)
  queue?: string;
  state?: string;
}

// Return value from redis INFO command.
// See https://redis.io/commands/info#return-value.
export interface RedisInfo {
  active_defrag_hits: string;
  active_defrag_key_hits: string;
  active_defrag_key_misses: string;
  active_defrag_misses: string;
  active_defrag_running: string;
  allocator_active: string;
  allocator_allocated: string;
  allocator_frag_bytes: string;
  allocator_frag_ratio: string;
  allocator_resident: string;
  allocator_rss_bytes: string;
  allocator_rss_ratio: string;
  aof_current_rewrite_time_sec: string;
  aof_enabled: string;
  aof_last_bgrewrite_status: string;
  aof_last_cow_size: string;
  aof_last_rewrite_time_sec: string;
  aof_last_write_status: string;
  aof_rewrite_in_progress: string;
  aof_rewrite_scheduled: string;
  arch_bits: string;
  atomicvar_api: string;
  blocked_clients: string;
  client_recent_max_input_buffer: string;
  client_recent_max_output_buffer: string;
  clients_in_timeout_table: string;
  cluster_enabled: string;
  config_file: string;
  configured_hz: string;
  connected_clients: string;
  connected_slaves: string;
  evicted_keys: string;
  executable: string;
  expire_cycle_cpu_milliseconds: string;
  expired_keys: string;
  expired_stale_perc: string;
  expired_time_cap_reached_count: string;
  gcc_version: string;
  hz: string;
  instantaneous_input_kbps: string;
  instantaneous_ops_per_sec: string;
  instantaneous_output_kbps: string;
  keyspace_hits: string;
  keyspace_misses: string;
  latest_fork_usec: string;
  lazyfree_pending_objects: string;
  loading: string;
  lru_clock: string;
  master_repl_offset: string;
  master_replid: string;
  master_replid2: string;
  maxmemory: string;
  maxmemory_human: string;
  maxmemory_policy: string;
  mem_allocator: string;
  mem_aof_buffer: string;
  mem_clients_normal: string;
  mem_clients_slaves: string;
  mem_fragmentation_bytes: string;
  mem_fragmentation_ratio: string;
  mem_not_counted_for_evict: string;
  mem_replication_backlog: string;
  migrate_cached_sockets: string;
  module_fork_in_progress: string;
  module_fork_last_cow_size: string;
  multiplexing_api: string;
  number_of_cached_scripts: string;
  os: string;
  process_id: string;
  pubsub_channels: string;
  pubsub_patterns: string;
  rdb_bgsave_in_progress: string;
  rdb_changes_since_last_save: string;
  rdb_current_bgsave_time_sec: string;
  rdb_last_bgsave_status: string;
  rdb_last_bgsave_time_sec: string;
  rdb_last_cow_size: string;
  rdb_last_save_time: string;
  redis_build_id: string;
  redis_git_dirty: string;
  redis_git_sha1: string;
  redis_mode: string;
  redis_version: string;
  rejected_connections: string;
  repl_backlog_active: string;
  repl_backlog_first_byte_offset: string;
  repl_backlog_histlen: string;
  repl_backlog_size: string;
  role: string;
  rss_overhead_bytes: string;
  rss_overhead_ratio: string;
  run_id: string;
  second_repl_offset: string;
  slave_expires_tracked_keys: string;
  sync_full: string;
  sync_partial_err: string;
  sync_partial_ok: string;
  tcp_port: string;
  total_commands_processed: string;
  total_connections_received: string;
  total_net_input_bytes: string;
  total_net_output_bytes: string;
  total_system_memory: string;
  total_system_memory_human: string;
  tracking_clients: string;
  tracking_total_items: string;
  tracking_total_keys: string;
  tracking_total_prefixes: string;
  unexpected_error_replies: string;
  uptime_in_days: string;
  uptime_in_seconds: string;
  used_cpu_sys: string;
  used_cpu_sys_children: string;
  used_cpu_user: string;
  used_cpu_user_children: string;
  used_memory: string;
  used_memory_dataset: string;
  used_memory_dataset_perc: string;
  used_memory_human: string;
  used_memory_lua: string;
  used_memory_lua_human: string;
  used_memory_overhead: string;
  used_memory_peak: string;
  used_memory_peak_human: string;
  used_memory_peak_perc: string;
  used_memory_rss: string;
  used_memory_rss_human: string;
  used_memory_scripts: string;
  used_memory_scripts_human: string;
  used_memory_startup: string;
}

export interface GroupInfo {
  group: string;
  size: number;
}

export interface Queue {
  queue: string;
  paused: boolean;
  size: number;
  groups: number;
  latency_msec: number;
  display_latency: string;
  memory_usage_bytes: number;
  active: number;
  pending: number;
  aggregating: number;
  scheduled: number;
  retry: number;
  archived: number;
  completed: number;
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

export interface TaskInfo {
  id: string;
  queue: string;
  type: string;
  payload: string;
  state: string;
  start_time: string; // Only applies to task.state == 'active'
  max_retry: number;
  retried: number;
  last_failed_at: string;
  error_message: string;
  next_process_at: string;
  timeout_seconds: number;
  deadline: string;
  group: string;
  completed_at: string;
  result: string;
  ttl_seconds: number;
  is_orphaned: boolean; // Only applies to task.state == 'active'
}

export interface ServerInfo {
  id: string;
  host: string;
  pid: number;
  concurrency: number;
  queue_priorities: { [qname: string]: number };
  strict_priority_enabled: boolean;
  start_time: string;
  status: string;
  active_workers: WorkerInfo[];
}

export interface WorkerInfo {
  task_id: string;
  queue: string;
  task_type: string;
  task_payload: string;
  start_time: string;
}

export interface SchedulerEntry {
  id: string;
  spec: string;
  task_type: string;
  task_payload: string;
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
    url: `${getBaseUrl()}/queues`,
  });
  return resp.data;
}

export async function deleteQueue(qname: string): Promise<void> {
  await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}`,
  });
}

export async function pauseQueue(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}:pause`,
  });
}

export async function resumeQueue(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}:resume`,
  });
}

export async function listQueueStats(): Promise<ListQueueStatsResponse> {
  const resp = await axios({
    method: "get",
    url: `${getBaseUrl()}/queue_stats`,
  });
  return resp.data;
}

export async function listGroups(qname: string): Promise<ListGroupsResponse> {
  const resp = await axios({
    method: "get",
    url: `${getBaseUrl()}/queues/${qname}/groups`,
  });
  return resp.data;
}

export async function getTaskInfo(
  qname: string,
  id: string
): Promise<TaskInfo> {
  const url = `${getBaseUrl()}/queues/${qname}/tasks/${id}`;
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listActiveTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListTasksResponse> {
  let url = `${getBaseUrl()}/queues/${qname}/active_tasks`;
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
    url: `${getBaseUrl()}/queues/${qname}/active_tasks/${taskId}:cancel`,
  });
}

export async function cancelAllActiveTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/active_tasks:cancel_all`,
  });
}

export async function batchCancelActiveTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchCancelTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/active_tasks:batch_cancel`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function listPendingTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListTasksResponse> {
  let url = `${getBaseUrl()}/queues/${qname}/pending_tasks`;
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
): Promise<ListTasksResponse> {
  let url = `${getBaseUrl()}/queues/${qname}/scheduled_tasks`;
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
): Promise<ListTasksResponse> {
  let url = `${getBaseUrl()}/queues/${qname}/retry_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listArchivedTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListTasksResponse> {
  let url = `${getBaseUrl()}/queues/${qname}/archived_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listCompletedTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListTasksResponse> {
  let url = `${getBaseUrl()}/queues/${qname}/completed_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listAggregatingTasks(
  qname: string,
  gname: string,
  pageOpts?: PaginationOptions
): Promise<ListAggregatingTasksResponse> {
  let url = `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function archivePendingTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/pending_tasks/${taskId}:archive`,
  });
}

export async function batchArchivePendingTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchArchiveTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/pending_tasks:batch_archive`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function archiveAllPendingTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/pending_tasks:archive_all`,
  });
}

export async function deletePendingTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/pending_tasks/${taskId}`,
  });
}

export async function batchDeletePendingTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/pending_tasks:batch_delete`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function deleteAllPendingTasks(
  qname: string
): Promise<DeleteAllTasksResponse> {
  const resp = await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/pending_tasks:delete_all`,
  });
  return resp.data;
}

export async function deleteAggregatingTask(
  qname: string,
  gname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks/${taskId}`,
  });
}

export async function batchDeleteAggregatingTasks(
  qname: string,
  gname: string,
  taskIds: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks:batch_delete`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function deleteAllAggregatingTasks(
  qname: string,
  gname: string
): Promise<DeleteAllTasksResponse> {
  const resp = await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks:delete_all`,
  });
  return resp.data;
}

export async function runAggregatingTask(
  qname: string,
  gname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks/${taskId}:run`,
  });
}

export async function batchRunAggregatingTasks(
  qname: string,
  gname: string,
  taskIds: string[]
): Promise<BatchRunTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks:batch_run`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function runAllAggregatingTasks(
  qname: string,
  gname: string
): Promise<RunAllTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks:run_all`,
  });
  return resp.data;
}

export async function archiveAggregatingTask(
  qname: string,
  gname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks/${taskId}:archive`,
  });
}

export async function batchArchiveAggregatingTasks(
  qname: string,
  gname: string,
  taskIds: string[]
): Promise<BatchArchiveTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks:batch_archive`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function archiveAllAggregatingTasks(
  qname: string,
  gname: string
): Promise<ArchiveAllTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/groups/${gname}/aggregating_tasks:archive_all`,
  });
  return resp.data;
}

export async function runScheduledTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks/${taskId}:run`,
  });
}

export async function archiveScheduledTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks/${taskId}:archive`,
  });
}

export async function deleteScheduledTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks/${taskId}`,
  });
}

export async function batchDeleteScheduledTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks:batch_delete`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function deleteAllScheduledTasks(
  qname: string
): Promise<DeleteAllTasksResponse> {
  const resp = await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks:delete_all`,
  });
  return resp.data;
}

export async function batchRunScheduledTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchRunTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks:batch_run`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function runAllScheduledTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks:run_all`,
  });
}

export async function batchArchiveScheduledTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchArchiveTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks:batch_archive`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function archiveAllScheduledTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/scheduled_tasks:archive_all`,
  });
}

export async function runRetryTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks/${taskId}:run`,
  });
}

export async function archiveRetryTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks/${taskId}:archive`,
  });
}

export async function deleteRetryTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks/${taskId}`,
  });
}

export async function batchDeleteRetryTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks:batch_delete`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function deleteAllRetryTasks(
  qname: string
): Promise<DeleteAllTasksResponse> {
  const resp = await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks:delete_all`,
  });
  return resp.data;
}

export async function batchRunRetryTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchRunTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks:batch_run`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function runAllRetryTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks:run_all`,
  });
}

export async function batchArchiveRetryTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchArchiveTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks:batch_archive`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function archiveAllRetryTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/retry_tasks:archive_all`,
  });
}

export async function runArchivedTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/archived_tasks/${taskId}:run`,
  });
}

export async function deleteArchivedTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/archived_tasks/${taskId}`,
  });
}

export async function batchDeleteArchivedTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/archived_tasks:batch_delete`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function deleteAllArchivedTasks(
  qname: string
): Promise<DeleteAllTasksResponse> {
  const resp = await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/archived_tasks:delete_all`,
  });
  return resp.data;
}

export async function batchRunArchivedTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchRunTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/archived_tasks:batch_run`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function runAllArchivedTasks(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/archived_tasks:run_all`,
  });
}

export async function deleteCompletedTask(
  qname: string,
  taskId: string
): Promise<void> {
  await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/completed_tasks/${taskId}`,
  });
}

export async function batchDeleteCompletedTasks(
  qname: string,
  taskIds: string[]
): Promise<BatchDeleteTasksResponse> {
  const resp = await axios({
    method: "post",
    url: `${getBaseUrl()}/queues/${qname}/completed_tasks:batch_delete`,
    data: {
      task_ids: taskIds,
    },
  });
  return resp.data;
}

export async function deleteAllCompletedTasks(
  qname: string
): Promise<DeleteAllTasksResponse> {
  const resp = await axios({
    method: "delete",
    url: `${getBaseUrl()}/queues/${qname}/completed_tasks:delete_all`,
  });
  return resp.data;
}

export async function listServers(): Promise<ListServersResponse> {
  const resp = await axios({
    method: "get",
    url: `${getBaseUrl()}/servers`,
  });
  return resp.data;
}

export async function listSchedulerEntries(): Promise<ListSchedulerEntriesResponse> {
  const resp = await axios({
    method: "get",
    url: `${getBaseUrl()}/scheduler_entries`,
  });
  return resp.data;
}

export async function listSchedulerEnqueueEvents(
  entryId: string
): Promise<ListSchedulerEnqueueEventsResponse> {
  const resp = await axios({
    method: "get",
    url: `${getBaseUrl()}/scheduler_entries/${entryId}/enqueue_events`,
  });
  return resp.data;
}

export async function getRedisInfo(): Promise<RedisInfoResponse> {
  const resp = await axios({
    method: "get",
    url: `${getBaseUrl()}/redis_info`,
  });
  return resp.data;
}

interface MetricsEndpointParams {
  endtime: number;
  duration: number;
  queues?: string; // comma-separated list of queues
}

export async function getMetrics(
  endTime: number,
  duration: number,
  queues: string[]
): Promise<MetricsResponse> {
  let params: MetricsEndpointParams = {
    endtime: endTime,
    duration: duration,
  };
  if (queues && queues.length > 0) {
    params.queues = queues.join(",");
  }
  const resp = await axios({
    method: "get",
    url: `${getBaseUrl()}/metrics?${queryString.stringify(params)}`,
  });
  return resp.data;
}
