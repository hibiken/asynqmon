export const paths = {
  HOME: "/",
  SETTINGS: "/settings",
  SERVERS: "/servers",
  SCHEDULERS: "/schedulers",
  QUEUE_DETAILS: "/queues/:qname",
  REDIS: "/redis",
  TASK_DETAILS: "/queues/:qname/tasks/:taskId",
};

/**************************************************************
                        Path Helper functions
 **************************************************************/

export function queueDetailsPath(qname: string, taskStatus?: string): string {
  const path = paths.QUEUE_DETAILS.replace(":qname", qname);
  if (taskStatus) {
    return `${path}?status=${taskStatus}`;
  }
  return path;
}

export function taskDetailsPath(qname: string, taskId: string): string {
  return paths.TASK_DETAILS.replace(":qname", qname).replace(":taskId", taskId);
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