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
import { useTheme, Theme } from "@material-ui/core/styles";

interface Props {
  data: ProcessedStats[];
}

interface ProcessedStats {
  queue: string; // name of the queue.
  succeeded: number; // number of tasks succeeded.
  failed: number; // number of tasks failed.
}

function ProcessedTasksChart(props: Props) {
  const theme = useTheme<Theme>();
  return (
    <ResponsiveContainer>
      <BarChart data={props.data} maxBarSize={120}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="queue" stroke={theme.palette.text.secondary} />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="succeeded"
          stackId="a"
          fill={theme.palette.success.light}
        />
        <Bar dataKey="failed" stackId="a" fill={theme.palette.error.light} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ProcessedTasksChart;
