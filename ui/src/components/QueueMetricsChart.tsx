import { useTheme } from "@material-ui/core/styles";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Metrics } from "../api";

interface Props {
  data: Metrics[];

  // both startTime and endTime are in unix time (seconds)
  startTime: number;
  endTime: number;

  // (optional): Tick formatter function for YAxis
  yAxisTickFormatter?: (val: number) => string;
}

// interface that rechart understands.
interface ChartData {
  timestamp: number;
  [qname: string]: number;
}

function toChartData(metrics: Metrics[]): ChartData[] {
  if (metrics.length === 0) {
    return [];
  }
  let byTimestamp: { [key: number]: ChartData } = {};
  for (let x of metrics) {
    for (let [ts, val] of x.values) {
      if (!byTimestamp[ts]) {
        byTimestamp[ts] = { timestamp: ts };
      }
      const qname = x.metric.queue;
      if (qname) {
        byTimestamp[ts][qname] = parseFloat(val);
      }
    }
  }
  return Object.values(byTimestamp);
}

const lineColors = [
  "#2085ec",
  "#72b4eb",
  "#0a417a",
  "#8464a0",
  "#cea9bc",
  "#323232",
];

function QueueMetricsChart(props: Props) {
  const theme = useTheme();

  const data = toChartData(props.data);
  const keys = props.data.map((x) => x.metric.queue);
  return (
    <ResponsiveContainer height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          minTickGap={10}
          dataKey="timestamp"
          domain={[props.startTime, props.endTime]}
          tickFormatter={(timestamp: number) =>
            new Date(timestamp * 1000).toLocaleTimeString()
          }
          type="number"
          scale="time"
          stroke={theme.palette.text.secondary}
        />
        <YAxis
          tickFormatter={props.yAxisTickFormatter}
          stroke={theme.palette.text.secondary}
        />
        <Tooltip
          labelFormatter={(timestamp: number) => {
            return new Date(timestamp * 1000).toLocaleTimeString();
          }}
        />
        <Legend />
        {keys.map((key, idx) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={lineColors[idx % lineColors.length]}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

QueueMetricsChart.defaultProps = {
  yAxisTickFormatter: (val: number) => val.toString(),
};

export default QueueMetricsChart;
