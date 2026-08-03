import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppState } from "../store";

// usePolling repeatedly calls doFn with a fix time delay specified
// by interval (in millisecond). Re-runs immediately when the selected
// Redis connection changes.
export function usePolling(doFn: () => void, interval: number) {
  const selectedConnection = useSelector(
    (state: AppState) => state.connections.selected
  );

  useEffect(() => {
    doFn();
    const id = setInterval(doFn, interval * 1000);
    return () => clearInterval(id);
  }, [interval, doFn, selectedConnection]);
}

// useQuery gets the URL search params from the current URL.
export function useQuery(): URLSearchParams {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
