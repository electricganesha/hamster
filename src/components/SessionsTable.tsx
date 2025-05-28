import { useState } from 'react';
import { AggregatedSession } from '@/app/types/session';
import { formatUtc } from '@/utils/date';
import {
  getSessionAverages,
  getSessionLengthMinutes,
  getSessionTotals,
  getSortedSessions,
} from '@/utils/session';
import { aggregateSessionsByDay } from '@/utils/data';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  IconButton,
  Collapse,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const DAY_COLORS = ['#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0', '#f3e5f5', '#f9fbe7', '#ede7f6'];

export const SessionsTable = ({ sessions }: Readonly<{ sessions: AggregatedSession[] }>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Group sessions by day (noon-to-noon)
  const byDay = aggregateSessionsByDay(sessions);
  const dayKeys = Object.keys(byDay).sort();

  // Find today's noon-to-noon day key
  const now = new Date();
  const todayNoon = new Date(now.getTime() - 12 * 60 * 60 * 1000); // subtract 12 hours
  const todayKey = `${todayNoon.getUTCFullYear()}-${String(todayNoon.getUTCMonth() + 1).padStart(2, '0')}-${String(todayNoon.getUTCDate()).padStart(2, '0')}`;

  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    dayKeys.reduce(
      (acc, key) => {
        acc[key] = key === todayKey;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );
  const toggleDay = (day: string) => setExpanded((prev) => ({ ...prev, [day]: !prev[day] }));
  const getDayColor = (idx: number) => DAY_COLORS[idx % DAY_COLORS.length];

  if (!isMobile) {
    return (
      <TableContainer
        component={Paper}
        sx={{
          mb: 2,
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'auto',
          minWidth: { xs: 400, sm: 0 },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Session Length (min)</TableCell>
              <TableCell>Rotations</TableCell>
              <TableCell>Distance (km)</TableCell>
              <TableCell>Speed (km/h)</TableCell>
              <TableCell>Avg Temp (°C)</TableCell>
              <TableCell>Avg Humidity (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dayKeys.map((day, idx) => {
              const daySessions = getSortedSessions(byDay[day]);
              const avg = getSessionAverages(daySessions);
              const totalRow = getSessionTotals(daySessions);
              return [
                <TableRow key={day + '-header'} sx={{ backgroundColor: getDayColor(idx) }}>
                  <TableCell colSpan={9} sx={{ p: 0 }}>
                    <Box display="flex" alignItems="center" sx={{ p: 2 }}>
                      <IconButton size="small" onClick={() => toggleDay(day)}>
                        {expanded[day] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        {day}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>,
                <TableRow key={day + '-collapse'} sx={{ backgroundColor: getDayColor(idx), p: 0 }}>
                  <TableCell colSpan={9} sx={{ p: 0, border: 0 }}>
                    <Collapse in={!!expanded[day]} timeout="auto" unmountOnExit>
                      <Table size="small" sx={{ backgroundColor: getDayColor(idx) }}>
                        <TableBody>
                          <TableRow key={day + '-avg'}>
                            <TableCell colSpan={3} align="right">
                              <b>Average</b>
                            </TableCell>
                            <TableCell>
                              <b>{avg?.sessionLength.toFixed(1)}</b>
                            </TableCell>
                            <TableCell>
                              <b>{avg?.rotations.toFixed(0)}</b>
                            </TableCell>
                            <TableCell>
                              <b>{avg?.distance.toFixed(2)}</b>
                            </TableCell>
                            <TableCell>
                              <b>{avg?.speed.toFixed(2)}</b>
                            </TableCell>
                            <TableCell>
                              <b>{avg?.temperature.toFixed(1)}</b>
                            </TableCell>
                            <TableCell>
                              <b>{avg?.humidity.toFixed(1)}</b>
                            </TableCell>
                          </TableRow>
                          <TableRow key={day + '-total'}>
                            <TableCell colSpan={3} align="right">
                              <b>Total</b>
                            </TableCell>
                            <TableCell>
                              <b>{totalRow?.sessionLength.toFixed(1)}</b>
                            </TableCell>
                            <TableCell>
                              <b>{totalRow?.rotations}</b>
                            </TableCell>
                            <TableCell>
                              <b>{totalRow?.distance.toFixed(2)}</b>
                            </TableCell>
                            <TableCell>
                              <b>-</b>
                            </TableCell>
                            <TableCell>
                              <b>-</b>
                            </TableCell>
                            <TableCell>
                              <b>-</b>
                            </TableCell>
                          </TableRow>
                          {daySessions.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell>{formatUtc(s.startTime, 'yyyy-MM-dd')}</TableCell>
                              <TableCell>{formatUtc(s.startTime, 'HH:mm')}</TableCell>
                              <TableCell>{formatUtc(s.endTime, 'HH:mm')}</TableCell>
                              <TableCell>{getSessionLengthMinutes(s).toFixed(1)}</TableCell>
                              <TableCell>{s.rotations}</TableCell>
                              <TableCell>{s.distance.toFixed(2)}</TableCell>
                              <TableCell>{s.speed.toFixed(2)}</TableCell>
                              <TableCell>{s.temperature.toFixed(1)}</TableCell>
                              <TableCell>{s.humidity.toFixed(1)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>,
              ];
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Stack spacing={2} sx={{ mb: 2 }}>
      {dayKeys.map((day, idx) => {
        const daySessions = getSortedSessions(byDay[day]);
        const avg = getSessionAverages(daySessions);
        const totalRow = getSessionTotals(daySessions);
        const color = getDayColor(idx);
        return (
          <Box key={day} sx={{ backgroundColor: color, borderRadius: 2, p: 1 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <IconButton size="small" onClick={() => toggleDay(day)}>
                {expanded[day] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {day}
              </Typography>
            </Box>
            <Collapse in={!!expanded[day]} timeout="auto" unmountOnExit>
              {daySessions.map((s) => (
                <Card key={s.id} variant="outlined" sx={{ mb: 1, backgroundColor: color }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      {formatUtc(s.startTime, 'yyyy-MM-dd')} | {formatUtc(s.startTime, 'HH:mm')} -{' '}
                      {formatUtc(s.endTime, 'HH:mm')}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Rotations: <b>{s.rotations}</b>
                    </Typography>
                    <Typography variant="body2">
                      Distance: <b>{s.distance.toFixed(2)} km</b>
                    </Typography>
                    <Typography variant="body2">
                      Speed: <b>{s.speed.toFixed(2)} km/h</b>
                    </Typography>
                    <Typography variant="body2">
                      Avg Temp: <b>{s.temperature.toFixed(1)} °C</b>
                    </Typography>
                    <Typography variant="body2">
                      Avg Humidity: <b>{s.humidity.toFixed(1)} %</b>
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              {avg && (
                <Card variant="outlined" sx={{ mb: 1, backgroundColor: color }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      <b>Average</b>
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Session Length: <b>{avg.sessionLength.toFixed(1)} min</b>
                    </Typography>
                    <Typography variant="body2">
                      Rotations: <b>{avg.rotations.toFixed(0)}</b>
                    </Typography>
                    <Typography variant="body2">
                      Distance: <b>{avg.distance.toFixed(2)} km</b>
                    </Typography>
                    <Typography variant="body2">
                      Speed: <b>{avg.speed.toFixed(2)} km/h</b>
                    </Typography>
                    <Typography variant="body2">
                      Avg Temp: <b>{avg.temperature.toFixed(1)} °C</b>
                    </Typography>
                    <Typography variant="body2">
                      Avg Humidity: <b>{avg.humidity.toFixed(1)} %</b>
                    </Typography>
                  </CardContent>
                </Card>
              )}
              {totalRow && (
                <Card variant="outlined" sx={{ mb: 1, backgroundColor: color }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      <b>Total</b>
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Session Length: <b>{totalRow.sessionLength.toFixed(1)} min</b>
                    </Typography>
                    <Typography variant="body2">
                      Rotations: <b>{totalRow.rotations}</b>
                    </Typography>
                    <Typography variant="body2">
                      Distance: <b>{totalRow.distance.toFixed(2)} km</b>
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
};
