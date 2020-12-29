export const paths = {
  HOME: "/",
  SETTINGS: "/settings",
  SERVERS: "/servers",
  SCHEDULERS: "/schedulers",
  QUEUE_DETAILS: "/queues/:qname",
};

export function queueDetailsPath(qname: string, taskStatus?: string): string {
  const path = paths.QUEUE_DETAILS.replace(":qname", qname);
  if (taskStatus) {
    return `${path}?status=${taskStatus}`;
  }
  return path;
}
