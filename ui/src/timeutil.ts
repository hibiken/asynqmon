interface Duration {
  hour: number;
  minute: number;
  second: number;
  totalSeconds: number;
}

// start and end are in milliseconds.
function durationBetween(start: number, end: number): Duration {
  const durationInMillisec = start - end;
  const totalSeconds = Math.floor(durationInMillisec / 1000);
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds - 3600 * hour) / 60);
  const second = totalSeconds - 3600 * hour - 60 * minute;
  return { hour, minute, second, totalSeconds };
}

function stringifyDuration(d: Duration): string {
  return (
    (d.hour !== 0 ? `${d.hour}h` : "") +
    (d.minute !== 0 ? `${d.minute}m` : "") +
    `${d.second}s`
  );
}

export function durationBefore(timestamp: string): string {
  try {
    const duration = durationBetween(Date.parse(timestamp), Date.now());
    if (duration.totalSeconds < 1) {
      return "now";
    }
    return stringifyDuration(duration);
  } catch {
    return "-";
  }
}

export function timeAgo(timestamp: string): string {
  try {
    const duration = durationBetween(Date.now(), Date.parse(timestamp));
    return stringifyDuration(duration) + " ago";
  } catch {
    return "-";
  }
}

export function getCurrentUTCDate(): string {
  const today = new Date();
  const dd = today.getUTCDate().toString().padStart(2, "0");
  const mm = (today.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}
