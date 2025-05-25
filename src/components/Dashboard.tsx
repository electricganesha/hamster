'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

import { Filters } from './Filters';
import { SessionsTable } from './SessionsTable';
import { ProgressCharts } from './ProgressCharts';
import { computeDistance } from '../utils/distance';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../app/theme';

function aggregateSessionsByDay(sessions: any[]): { [day: string]: any[] } {
  const byDay: { [day: string]: any[] } = {};
  sessions.forEach((s) => {
    const day = format(parseISO(s.startTime), 'yyyy-MM-dd');
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(s);
  });
  return byDay;
}

type Session = {
  id: string | number;
  startTime: string;
  endTime: string;
  rotations: number;
  temperature: number;
  humidity: number;
  image?: string;
};

export default function HamsterSessionsDashboard() {
  const today = new Date();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 1000]);
  const [tempRange, setTempRange] = useState<[number, number]>([0, 40]);
  const [humidityRange, setHumidityRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startOfDay(today),
    endOfDay(today),
  ]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/hamster-session?page=1&pageSize=1000')
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const dist = computeDistance(s.rotations);
      const temp = s.temperature;
      const hum = s.humidity;
      const date = parseISO(s.startTime);
      return (
        dist >= distanceRange[0] &&
        dist <= distanceRange[1] &&
        temp >= tempRange[0] &&
        temp <= tempRange[1] &&
        hum >= humidityRange[0] &&
        hum <= humidityRange[1] &&
        (!dateRange[0] ||
          !dateRange[1] ||
          isWithinInterval(date, { start: dateRange[0], end: dateRange[1] })) &&
        (!search || (s.image && s.image.toLowerCase().includes(search.toLowerCase())))
      );
    });
  }, [sessions, distanceRange, tempRange, humidityRange, dateRange, search]);

  const byDay = useMemo(() => aggregateSessionsByDay(filtered), [filtered]);
  const chartData = useMemo(() => {
    const days = Object.keys(byDay).sort();
    return {
      days,
      distance: days.map((d) => byDay[d].reduce((sum, s) => sum + computeDistance(s.rotations), 0)),
      avgTemp: days.map(
        (d) => byDay[d].reduce((sum, s) => sum + s.temperature, 0) / byDay[d].length,
      ),
      avgHumidity: days.map(
        (d) => byDay[d].reduce((sum, s) => sum + s.humidity, 0) / byDay[d].length,
      ),
    };
  }, [byDay]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Box p={2}>
          <Typography variant="h4" gutterBottom>
            🐹 Mooey Maria Hazel 🐹 Monitoring Dashboard
          </Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Filters
              distanceRange={distanceRange}
              setDistanceRange={setDistanceRange}
              tempRange={tempRange}
              setTempRange={setTempRange}
              humidityRange={humidityRange}
              setHumidityRange={setHumidityRange}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </Paper>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <SessionsTable sessions={filtered} />
              <ProgressCharts chartData={chartData} />
            </>
          )}
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
