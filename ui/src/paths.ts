export const paths = () => ({
  HOME: `${window.ROOT_PATH}/`,
  SETTINGS: `${window.ROOT_PATH}/settings`,
  SERVERS: `${window.ROOT_PATH}/servers`,
  SCHEDULERS: `${window.ROOT_PATH}/schedulers`,
  QUEUE_DETAILS: `${window.ROOT_PATH}/queues/:qname`,
  REDIS: `${window.ROOT_PATH}/redis`,
  TASK_DETAILS: `${window.ROOT_PATH}/queues/:qname/tasks/:taskId`,
  QUEUE_METRICS: `${window.ROOT_PATH}/q/metrics`,
});

/**************************************************************
                        Path Helper functions
 **************************************************************/

export function queueDetailsPath(qname: string, taskStatus?: string): string {
  const path = paths().QUEUE_DETAILS.replace(":qname", qname);
  if (taskStatus) {
    return `${path}?status=${taskStatus}`;
  }
  return path;
}

export function taskDetailsPath(qname: string, taskId: string): string {
  return paths()
    .TASK_DETAILS.replace(":qname", qname)
    .replace(":taskId", taskId);
}

/**************************************************************
                        URL Params
 **************************************************************/

export interface QueueDetailsRouteParams {
  qname: string;
}

export interface TaskDetailsRouteParams {
  qname: string;
  taskId: string;
}
