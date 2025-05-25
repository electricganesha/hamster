import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { format, parseISO } from "date-fns";

import { computeDistance } from "../utils/distance";

type Session = {
  id: string | number;
  startTime: string;
  endTime: string;
  rotations: number;
  temperature: number;
  humidity: number;
  image?: string;
};

export function SessionsTable({ sessions }: { sessions: Session[] }) {
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Distance (m)</TableCell>
            <TableCell>Rotations</TableCell>
            <TableCell>Avg Temp (°C)</TableCell>
            <TableCell>Avg Humidity (%)</TableCell>
            <TableCell>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                {format(parseISO(s.startTime), "yyyy-MM-dd")}
              </TableCell>
              <TableCell>{format(parseISO(s.startTime), "HH:mm")}</TableCell>
              <TableCell>{format(parseISO(s.endTime), "HH:mm")}</TableCell>
              <TableCell>{computeDistance(s.rotations).toFixed(2)}</TableCell>
              <TableCell>{s.rotations}</TableCell>
              <TableCell>{s.temperature.toFixed(1)}</TableCell>
              <TableCell>{s.humidity.toFixed(1)}</TableCell>
              <TableCell>
                {s.image ? (
                  <img
                    src={s.image}
                    alt="session"
                    width={40}
                    height={40}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
