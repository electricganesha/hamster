'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Filters } from './Filters';
import { SessionsTable } from './SessionsTable';
import { ProgressCharts } from './ProgressCharts';
import { aggregateSessionsByDay, filterSessions, getChartData } from '../utils/data';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../app/theme';
import { AboutModal } from './AboutModal';
import { AggregatedSession } from '@/app/types/session';
import { computeSessionDerivedFields } from '@/utils/computation';
import { getInitialDateRange } from '@/utils/date';

const HamsterSessionsDashboard = () => {
  const [sessions, setSessions] = useState<AggregatedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 1000]);
  const [tempRange, setTempRange] = useState<[number, number]>([0, 40]);
  const [humidityRange, setHumidityRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(getInitialDateRange());
  const [rotationRange, setRotationRange] = useState<[number, number]>([0, 5000]);
  const [speedRange, setSpeedRange] = useState<[number, number]>([0, 20]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/hamster-session?page=1&pageSize=1000')
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.map(computeSessionDerivedFields));
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () =>
      filterSessions(sessions, {
        distanceRange,
        tempRange,
        humidityRange,
        dateRange,
        rotationRange,
        speedRange,
      }),
    [sessions, distanceRange, tempRange, humidityRange, dateRange, rotationRange, speedRange],
  );

  const byDay = useMemo(() => aggregateSessionsByDay(filtered), [filtered]);
  const chartData = useMemo(() => getChartData(byDay), [byDay]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Box p={{ xs: 1, sm: 2 }} position="relative">
          <AboutModal />
          <Typography
            variant="h4"
            gutterBottom
            fontSize={{ xs: 22, sm: 28 }}
            sx={{ width: { xs: '80%' } }}
          >
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
              rotationRange={rotationRange}
              setRotationRange={setRotationRange}
              speedRange={speedRange}
              setSpeedRange={setSpeedRange}
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
