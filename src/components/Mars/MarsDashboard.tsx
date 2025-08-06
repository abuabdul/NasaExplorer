"use client";

import { useEffect, useState } from "react";
import { useMarsRoverPhotos } from "@/hooks/useMarsRoverPhotos";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import WatneyMessage from "./WatneyMessage";

const rovers = ["curiosity", "opportunity", "spirit"];
const cameras = ["FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];
const colors = ["#16a34a", "#3b82f6", "#f59e0b", "#ef4444", "#6366f1", "#10b981"];

export default function MarsDashboard() {
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [sol, setSol] = useState("1000");
  const [camera, setCamera] = useState<string | undefined>(undefined);
  const [earthDate, setEarthDate] = useState<string | undefined>(undefined);
  const [page] = useState(1);

  const { data, isLoading, refetch } = useMarsRoverPhotos(selectedRover, {
    sol: Number(sol),
    camera,
    earth_date: earthDate,
    page,
  });

  useEffect(() => {
    if (!earthDate && data?.length) {
      setEarthDate(data[0].earth_date);
    }
  }, [data, earthDate]);

  const totalPhotos = data?.length || 0;

  const cameraCounts = data?.reduce((acc, photo) => {
    acc[photo.camera.name] = (acc[photo.camera.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = cameraCounts
    ? Object.entries(cameraCounts).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Rover</label>
          <Select onValueChange={setSelectedRover} defaultValue={selectedRover}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Rover" />
            </SelectTrigger>
            <SelectContent>
              {rovers.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Sol</label>
          <Input
            placeholder="e.g. 1000"
            value={sol}
            onChange={(e) => setSol(e.target.value)}
            className="w-[120px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Earth Date</label>
          <Input
            type="date"
            value={earthDate ?? ""}
            onChange={(e) => setEarthDate(e.target.value || undefined)}
            className="w-[180px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Camera</label>
          <Select onValueChange={(val) => setCamera(val || undefined)} value={camera || "All"}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Cameras" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Cameras</SelectItem>
              {cameras.map((cam) => (
                <SelectItem key={cam} value={cam}>
                  {cam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && <p className="text-zinc-500">Fetching data from Mars...</p>}

      {!isLoading && (!data || data.length === 0) && (
        <WatneyMessage onRetry={() => !isLoading && refetch()} isLoading={isLoading}>
            <div className="text-center text-zinc-500 italic mt-10">
                No photos found for the selected parameters.
            </div>
        </WatneyMessage>
      )}

      {!isLoading && data && data.length > 0 && (
        <>
          <p className="text-zinc-700 dark:text-zinc-200 font-medium mb-4">
            Total Photos: <span className="font-bold">{totalPhotos}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Camera Usage</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Photo Count</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Sample Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.slice(0, 12).map((photo) => (
                <div key={photo.id} className="rounded overflow-hidden shadow">
                  <Image
                    src={photo.img_src}
                    alt={photo.camera.full_name}
                    width={400}
                    height={400}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <strong>{photo.camera.name}</strong> on Sol {photo.sol}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
