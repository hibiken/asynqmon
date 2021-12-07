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

function QueueSizeMetricsChart(props: Props) {
  const data = toChartData(props.data);
  const keys = props.data.map((x) => x.metric.queue);
  return (
    <ResponsiveContainer maxHeight={260}>
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
        />
        <YAxis />
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

export default QueueSizeMetricsChart;
