'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress, styled } from '@mui/material';
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
import { getSessionAverages, getSessionTotals, getSessionLengthMinutes } from '@/utils/session';

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
  // Compute the total of all days combined, then show the average per session for the selected time frame
  const overallTotals = useMemo(() => getSessionTotals(filtered), [filtered]);
  const overallAverages = useMemo(() => getSessionAverages(filtered), [filtered]);
  // Compute min/max/fastest/slowest/shortest/longest session
  const minDistance = useMemo(
    () => (filtered.length ? Math.min(...filtered.map((s) => s.distance)) : null),
    [filtered],
  );
  const maxDistance = useMemo(
    () => (filtered.length ? Math.max(...filtered.map((s) => s.distance)) : null),
    [filtered],
  );
  const fastestSession = useMemo(
    () => (filtered.length ? Math.max(...filtered.map((s) => s.speed)) : null),
    [filtered],
  );
  const slowestSession = useMemo(
    () => (filtered.length ? Math.min(...filtered.map((s) => s.speed)) : null),
    [filtered],
  );
  const shortestSession = useMemo(
    () => (filtered.length ? Math.min(...filtered.map((s) => getSessionLengthMinutes(s))) : null),
    [filtered],
  );
  const longestSession = useMemo(
    () => (filtered.length ? Math.max(...filtered.map((s) => getSessionLengthMinutes(s))) : null),
    [filtered],
  );
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
              <Box
                sx={{
                  width: '100%',
                  overflowX: 'auto',
                  mb: 1,
                }}
              >
                <Paper sx={{ p: 1, background: theme.palette.grey[100], mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ minWidth: 120, fontWeight: 600 }}>
                    Overview (All selected sessions):
                  </Typography>
                  <hr />
                  <Box
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    sx={{
                      mt: 2,
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Pill>
                      Tot. Session:{' '}
                      <b>
                        <br />
                        {overallTotals?.sessionLength?.toFixed(1) ?? '-'}
                      </b>{' '}
                      min
                    </Pill>
                    <Pill>
                      Tot. Rotations:{' '}
                      <b>
                        <br />
                        {overallTotals?.rotations ?? '-'}
                      </b>
                    </Pill>
                    <Pill>
                      Tot. Distance:{' '}
                      <b>
                        <br />
                        {overallTotals?.distance?.toFixed(2) ?? '-'}
                      </b>{' '}
                      km
                    </Pill>
                    <Pill>
                      Avg. Session:{' '}
                      <b>
                        <br />
                        {overallAverages?.sessionLength?.toFixed(1) ?? '-'}
                      </b>{' '}
                      min
                    </Pill>
                    <Pill>
                      Avg. Rotations:{' '}
                      <b>
                        {' '}
                        <br />
                        {overallAverages?.rotations?.toFixed(0) ?? '-'}
                      </b>
                    </Pill>
                    <Pill>
                      Avg. Distance:{' '}
                      <b>
                        {' '}
                        <br />
                        {overallAverages?.distance?.toFixed(2) ?? '-'}
                      </b>{' '}
                      km
                    </Pill>
                    <Pill>
                      Avg. Speed:{' '}
                      <b>
                        {' '}
                        <br />
                        {overallAverages?.speed?.toFixed(2) ?? '-'}
                      </b>{' '}
                      km/h
                    </Pill>
                    <Pill>
                      Avg. Temp:{' '}
                      <b>
                        {' '}
                        <br />
                        {overallAverages?.temperature?.toFixed(1) ?? '-'}
                      </b>{' '}
                      °C
                    </Pill>
                    <Pill>
                      Avg. Humidity:{' '}
                      <b>
                        {' '}
                        <br />
                        {overallAverages?.humidity?.toFixed(1) ?? '-'}
                      </b>{' '}
                      %
                    </Pill>
                    <Pill>
                      Min Distance:{' '}
                      <b>
                        {' '}
                        <br />
                        {minDistance !== null ? minDistance.toFixed(2) : '-'}
                      </b>{' '}
                      km
                    </Pill>
                    <Pill>
                      Max Distance:{' '}
                      <b>
                        {' '}
                        <br />
                        {maxDistance !== null ? maxDistance.toFixed(2) : '-'}
                      </b>{' '}
                      km
                    </Pill>
                    <Pill>
                      Fastest Session:{' '}
                      <b>
                        {' '}
                        <br />
                        {fastestSession !== null ? fastestSession.toFixed(2) : '-'}
                      </b>{' '}
                      km/h
                    </Pill>
                    <Pill>
                      Slowest Session:{' '}
                      <b>
                        {' '}
                        <br />
                        {slowestSession !== null ? slowestSession.toFixed(2) : '-'}
                      </b>{' '}
                      km/h
                    </Pill>
                    <Pill>
                      Shortest Session:{' '}
                      <b>
                        {' '}
                        <br />
                        {shortestSession !== null ? shortestSession.toFixed(1) : '-'}
                      </b>{' '}
                      min
                    </Pill>
                    <Pill>
                      Longest Session:{' '}
                      <b>
                        {' '}
                        <br />
                        {longestSession !== null ? longestSession.toFixed(1) : '-'}
                      </b>{' '}
                      min
                    </Pill>
                  </Box>
                </Paper>
              </Box>
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

const Pill = styled(Typography)(({ theme }) => ({
  variant: 'body2',
  display: 'inline-block',
  padding: theme.spacing(0.5, 1),
  border: `1px solid ${theme.palette.grey[900]}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.grey[900],
  fontSize: '0.7rem',
  fontWeight: 500,
  width: '110px',
  height: '48px',
  textAlign: 'center',
}));
