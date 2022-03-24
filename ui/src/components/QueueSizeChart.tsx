import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useHistory } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import { queueDetailsPath } from "../paths";

interface Props {
  data: TaskBreakdown[];
}

interface TaskBreakdown {
  queue: string; // name of the queue.
  active: number; // number of active tasks in the queue.
  pending: number; // number of pending tasks in the queue.
  aggregating: number; // number of aggregating tasks in the queue.
  scheduled: number; // number of scheduled tasks in the queue.
  retry: number; // number of retry tasks in the queue.
  archived: number; // number of archived tasks in the queue.
  completed: number; // number of completed tasks in the queue.
}

function QueueSizeChart(props: Props) {
  const theme = useTheme();
  const handleClick = (params: { activeLabel?: string } | null) => {
    const allQueues = props.data.map((b) => b.queue);
    if (
      params &&
      params.activeLabel &&
      allQueues.includes(params.activeLabel)
    ) {
      history.push(queueDetailsPath(params.activeLabel));
    }
  };
  const history = useHistory();
  return (
    <ResponsiveContainer>
      <BarChart
        data={props.data}
        maxBarSize={120}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="queue" stroke={theme.palette.text.secondary} />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip />
        <Legend />
        <Bar dataKey="active" stackId="a" fill="#1967d2" />
        <Bar dataKey="pending" stackId="a" fill="#669df6" />
        <Bar dataKey="aggregating" stackId="a" fill="#e69138" />
        <Bar dataKey="scheduled" stackId="a" fill="#fdd663" />
        <Bar dataKey="retry" stackId="a" fill="#f666a9" />
        <Bar dataKey="archived" stackId="a" fill="#ac4776" />
        <Bar dataKey="completed" stackId="a" fill="#4bb543" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default QueueSizeChart;
