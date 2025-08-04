
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cameras = ["FHAZ", "RHAZ", "NAVCAM", "MAST", "CHEMCAM", "MAHLI", "MARDI"];

type Props = {
  rover: string;
  sol: number;
  setSol: (sol: number) => void;
  camera: string;
  setCamera: (camera: string) => void;
  earthDate: string;
  setEarthDate: (date: string) => void;
};

export default function FilterPanel({
  sol,
  setSol,
  camera,
  setCamera,
  earthDate,
  setEarthDate,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="sol">Martian Sol</Label>
        <Input
          id="sol"
          type="number"
          value={sol}
          onChange={(e) => setSol(Number(e.target.value))}
          min={0}
        />
      </div>

      <div>
        <Label htmlFor="earthDate">Earth Date</Label>
        <Input
          id="earthDate"
          type="date"
          value={earthDate}
          onChange={(e) => setEarthDate(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="camera">Camera</Label>
        <Select onValueChange={setCamera} value={camera}>
          <SelectTrigger id="camera">
            <SelectValue placeholder="All Cameras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {cameras.map((cam) => (
              <SelectItem key={cam} value={cam}>
                {cam}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}