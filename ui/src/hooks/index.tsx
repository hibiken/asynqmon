import { useEffect } from "react";

// usePolling repeatedly calls doFn with a fix time delay specified
// by interval (in millisecond).
export function usePolling(doFn: () => void, interval: number) {
  useEffect(() => {
    doFn();
    const id = setInterval(doFn, interval * 1000);
    return () => clearInterval(id);
  }, [interval, doFn]);
}
