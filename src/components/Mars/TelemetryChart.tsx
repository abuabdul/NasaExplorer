"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { useMarsPhotos } from "@/hooks/useMarsRovers";
import { LoaderCircle } from "lucide-react";

interface TelemetryChartProps {
  rover: "curiosity" | "opportunity" | "spirit";
  sol: number;
  camera?: string;
  earthDate?: string;
}

export default function TelemetryChart({ rover, sol, camera, earthDate }: TelemetryChartProps) {
  const { data, isLoading, error } = useMarsPhotos({
    rover,
    sol,
    camera,
    earth_date: earthDate,
    page: 1,
  });

  const chartData = useMemo(() => {
    if (!data) return [];

    const solMap: Record<number, number> = {};

    for (const photo of data) {
      solMap[photo.sol] = (solMap[photo.sol] || 0) + 1;
    }

    return Object.entries(solMap)
      .map(([sol, count]) => ({ sol: Number(sol), photos: count }))
      .sort((a, b) => a.sol - b.sol);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <LoaderCircle className="animate-spin w-6 h-6 mr-2" />
        Loading telemetry data...
      </div>
    );
  }

  if (error || chartData.length === 0) {
    return (
      <div className="text-center text-zinc-500 italic h-64 flex items-center justify-center">
        No telemetry data available for the selected filters.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-red-400">
        Photo Frequency Over Sols
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="sol" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip
            contentStyle={{ backgroundColor: "#111", borderColor: "#333" }}
          />
          <Line
            type="monotone"
            dataKey="photos"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
