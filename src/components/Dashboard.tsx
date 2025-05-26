'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

import { Filters } from './Filters';
import { SessionsTable } from './SessionsTable';
import { ProgressCharts } from './ProgressCharts';
import {
  aggregateSessionsByDay,
  computeDistance,
  computeSessionDerivedFields,
} from '../utils/utils';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../app/theme';
import { AboutModal } from './AboutModal';
import { AggregatedSession } from '@/app/types/session';

const HamsterSessionsDashboard = () => {
  const today = new Date();
  const [sessions, setSessions] = useState<AggregatedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 1000]);
  const [tempRange, setTempRange] = useState<[number, number]>([0, 40]);
  const [humidityRange, setHumidityRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startOfDay(today),
    endOfDay(today),
  ]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/hamster-session?page=1&pageSize=1000')
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.map(computeSessionDerivedFields));
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
          isWithinInterval(date, { start: dateRange[0], end: dateRange[1] }))
      );
    });
  }, [sessions, distanceRange, tempRange, humidityRange, dateRange]);

  const byDay = useMemo(() => aggregateSessionsByDay(filtered), [filtered]);
  const chartData = useMemo(() => {
    const days = Object.keys(byDay).sort((a, b) => a.localeCompare(b));
    return {
      days,
      distance: days.map((d) =>
        byDay[d].reduce((sum: number, s: AggregatedSession) => sum + s.distance, 0),
      ),
      rotations: days.map((d) =>
        byDay[d].reduce((sum: number, s: AggregatedSession) => sum + s.rotations, 0),
      ),
      speed: days.map((d) => {
        const totalDistance = byDay[d].reduce(
          (sum: number, s: AggregatedSession) => sum + s.distance,
          0,
        );
        const totalDuration = byDay[d].reduce((sum: number, s: AggregatedSession) => {
          const start = new Date(s.startTime).getTime() / 1000;
          const end = new Date(s.endTime).getTime() / 1000;
          return sum + Math.max(0, end - start);
        }, 0);
        return totalDuration > 0 ? totalDistance / totalDuration : 0;
      }),
      avgTemp: days.map(
        (d) =>
          byDay[d].reduce((sum: number, s: AggregatedSession) => sum + s.temperature, 0) /
          byDay[d].length,
      ),
      avgHumidity: days.map(
        (d) =>
          byDay[d].reduce((sum: number, s: AggregatedSession) => sum + s.humidity, 0) /
          byDay[d].length,
      ),
    };
  }, [byDay]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Box p={{ xs: 1, sm: 2 }} position="relative">
          <AboutModal />
          <Typography variant="h4" gutterBottom fontSize={{ xs: 22, sm: 28 }}>
            🐹 Mooey Maria Hazel 🐹 Monitoring Dashboard
          </Typography>
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <SessionsTable sessions={filtered} />
              </Box>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <ProgressCharts chartData={chartData} />
              </Box>
            </>
          )}
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default HamsterSessionsDashboard;
