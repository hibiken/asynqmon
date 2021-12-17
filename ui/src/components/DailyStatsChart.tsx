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
import { useTheme, Theme } from "@material-ui/core/styles";
import { DailyStat } from "../api";

interface Props {
  data: { [qname: string]: DailyStat[] };
  numDays: number;
}

interface ChartData {
  succeeded: number;
  failed: number;
  date: string;
}

export default function DailyStatsChart(props: Props) {
  const data = makeChartData(props.data, props.numDays);
  const theme = useTheme<Theme>();
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          minTickGap={10}
          stroke={theme.palette.text.secondary}
        />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="succeeded"
          stroke={theme.palette.success.main}
        />
        <Line
          type="monotone"
          dataKey="failed"
          stroke={theme.palette.error.main}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function makeChartData(
  queueStats: { [qname: string]: DailyStat[] },
  numDays: number
): ChartData[] {
  const dataByDate: { [date: string]: ChartData } = {};
  for (const qname in queueStats) {
    for (const stat of queueStats[qname]) {
      if (!dataByDate.hasOwnProperty(stat.date)) {
        dataByDate[stat.date] = { succeeded: 0, failed: 0, date: stat.date };
      }
      dataByDate[stat.date].succeeded += stat.processed - stat.failed;
      dataByDate[stat.date].failed += stat.failed;
    }
  }
  return Object.values(dataByDate).sort(sortByDate).slice(-numDays);
}

function sortByDate(x: ChartData, y: ChartData): number {
  return Date.parse(x.date) - Date.parse(y.date);
}
