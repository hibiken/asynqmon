import {
  LIST_QUEUES_SUCCESS,
  QueuesActionTypes,
} from "../actions/queuesActions";
import {
  LIST_QUEUE_STATS_BEGIN,
  LIST_QUEUE_STATS_ERROR,
  LIST_QUEUE_STATS_SUCCESS,
  QueueStatsActionTypes,
} from "../actions/queueStatsActions";
import { DailyStat } from "../api";

interface QueueStatsState {
  loading: boolean;
  data: { [qname: string]: DailyStat[] };
}

const initialState: QueueStatsState = {
  loading: false,
  data: {},
};

export default function queueStatsReducer(
  state = initialState,
  action: QueueStatsActionTypes | QueuesActionTypes
): QueueStatsState {
  switch (action.type) {
    case LIST_QUEUE_STATS_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case LIST_QUEUE_STATS_SUCCESS:
      return {
        data: action.payload.stats,
        loading: false,
      };

    case LIST_QUEUE_STATS_ERROR:
      return {
        ...state,
        loading: false,
      };

    case LIST_QUEUES_SUCCESS: {
      // Copy to avoid mutation.
      let newData = { ...state.data };
      // Update today's stats with most up-to-date data.
      for (const q of action.payload.queues) {
        const stats = newData[q.queue];
        if (!stats) {
          continue;
        }
        const newStats = stats.map((stat) => {
          if (isSameDate(stat.date, q.timestamp)) {
            return {
              ...stat,
              processed: q.processed,
              failed: q.failed,
            };
          }
          return stat;
        });
        newData[q.queue] = newStats;
      }
      return { ...state, data: newData };
    }

    default:
      return state;
  }
}

// Returns true if two timestamps are from the same date.
function isSameDate(ts1: string, ts2: string): boolean {
  return new Date(ts1).toDateString() === new Date(ts2).toDateString();
}
