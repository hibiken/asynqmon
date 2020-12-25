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
        <Bar dataKey="active" stackId="a" fill="#1967d2" />
        <Bar dataKey="pending" stackId="a" fill="#669df6" />
        <Bar dataKey="scheduled" stackId="a" fill="#fdd663" />
        <Bar dataKey="retry" stackId="a" fill="#f666a9" />
        <Bar dataKey="dead" stackId="a" fill="#ac4776" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default QueueSizeChart;
