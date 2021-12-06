import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

// usePolling repeatedly calls doFn with a fix time delay specified
// by interval (in millisecond).
export function usePolling(doFn: () => void, interval: number) {
  useEffect(() => {
    doFn();
    const id = setInterval(doFn, interval * 1000);
    return () => clearInterval(id);
  }, [interval, doFn]);
}

// useQuery gets the URL search params from the current URL.
export function useQuery(): URLSearchParams {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
