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

interface Props {
  data: TaskBreakdown[];
}

interface TaskBreakdown {
  queue: string; // name of the queue.
  active: number; // number of active tasks in the queue.
  pending: number; // number of pending tasks in the queue.
  scheduled: number; // number of scheduled tasks in the queue.
  retry: number; // number of retry tasks in the queue.
  dead: number; // number of dead tasks in the queue.
}

function QueueSizeChart(props: Props) {
  return (
    <ResponsiveContainer>
      <BarChart data={props.data} maxBarSize={120}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="queue" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="active" stackId="a" fill="#7bb3ff" />
        <Bar dataKey="pending" stackId="a" fill="#e86af0" />
        <Bar dataKey="scheduled" stackId="a" fill="#9e379f" />
        <Bar dataKey="retry" stackId="a" fill="#493267" />
        <Bar dataKey="dead" stackId="a" fill="#373854" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default QueueSizeChart;
