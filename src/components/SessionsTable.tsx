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
import { darkenColor, getDayColor } from '@/utils/color';

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

  if (sessions.length === 0) {
    return null;
  }

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
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Start</TableCell>
              <TableCell align="center">End</TableCell>
              <TableCell align="center">Session Length (min)</TableCell>
              <TableCell align="center">Rotations</TableCell>
              <TableCell align="center">Distance (km)</TableCell>
              <TableCell align="center">Speed (km/h)</TableCell>
              <TableCell align="center">Avg Temp (°C)</TableCell>
              <TableCell align="center">Avg Humidity (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dayKeys.map((day, idx) => {
              const daySessions = getSortedSessions(byDay[day]);
              const avg = getSessionAverages(daySessions);
              const totalRow = getSessionTotals(daySessions);
              return (
                <>
                  <TableRow
                    key={day + '-header'}
                    sx={{ backgroundColor: getDayColor(idx), height: 48 }}
                  >
                    <TableCell
                      align="left"
                      sx={{
                        p: '6px 16px',
                        borderBottom: 0,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        verticalAlign: 'middle',
                        minWidth: 120,
                      }}
                    >
                      <Box display="flex" alignItems="center" sx={{ p: 0 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleDay(day)}
                          sx={{ ml: -1, mr: 0.5 }}
                        >
                          {expanded[day] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        <span style={{ fontWeight: 600 }}>{day}</span>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        p: '6px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        borderBottom: 0,
                        verticalAlign: 'middle',
                      }}
                    >
                      {daySessions.length ? formatUtc(daySessions[0]?.startTime, 'HH:mm') : '-'}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        p: '6px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        borderBottom: 0,
                        verticalAlign: 'middle',
                      }}
                    >
                      {daySessions.length
                        ? formatUtc(daySessions[daySessions.length - 1]?.endTime, 'HH:mm')
                        : '-'}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        p: '6px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        borderBottom: 0,
                        verticalAlign: 'middle',
                      }}
                    >
                      {totalRow ? totalRow.sessionLength.toFixed(1) : '-'}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        p: '6px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        borderBottom: 0,
                        verticalAlign: 'middle',
                      }}
                    >
                      {totalRow ? totalRow.rotations : '-'}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        p: '6px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        borderBottom: 0,
                        verticalAlign: 'middle',
                      }}
                    >
                      {totalRow ? totalRow.distance.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        p: '6px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        borderBottom: 0,
                        verticalAlign: 'middle',
                      }}
                    >
                      {avg ? avg.speed.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        p: '6px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        borderBottom: 0,
                        verticalAlign: 'middle',
                      }}
                    >
                      {avg ? avg.temperature.toFixed(1) : '-'}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        p: '6px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        borderBottom: 0,
                        verticalAlign: 'middle',
                      }}
                    >
                      {avg ? avg.humidity.toFixed(1) : '-'}
                    </TableCell>
                  </TableRow>
                  {expanded[day] && (
                    <>
                      {daySessions.map((s) => (
                        <TableRow key={s.id} sx={{ backgroundColor: getDayColor(idx) }}>
                          <TableCell align="left">{formatUtc(s.startTime, 'yyyy-MM-dd')}</TableCell>
                          <TableCell align="center">{formatUtc(s.startTime, 'HH:mm')}</TableCell>
                          <TableCell align="center">{formatUtc(s.endTime, 'HH:mm')}</TableCell>
                          <TableCell align="center">
                            {getSessionLengthMinutes(s).toFixed(1)}
                          </TableCell>
                          <TableCell align="center">{s.rotations}</TableCell>
                          <TableCell align="center">{s.distance.toFixed(2)}</TableCell>
                          <TableCell align="center">{s.speed.toFixed(2)}</TableCell>
                          <TableCell align="center">{s.temperature.toFixed(1)}</TableCell>
                          <TableCell align="center">{s.humidity.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow
                        key={day + '-avg'}
                        sx={{ backgroundColor: darkenColor(getDayColor(idx), 0.85) }}
                      >
                        <TableCell colSpan={1} align="left">
                          <b>Average</b>
                        </TableCell>
                        <TableCell align="center" />
                        <TableCell align="center" />
                        <TableCell align="center">
                          <b>{avg?.sessionLength.toFixed(1)}</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>{avg?.rotations.toFixed(0)}</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>{avg?.distance.toFixed(2)}</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>{avg?.speed.toFixed(2)}</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>{avg?.temperature.toFixed(1)}</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>{avg?.humidity.toFixed(1)}</b>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key={day + '-total'}
                        sx={{ backgroundColor: darkenColor(getDayColor(idx), 0.7) }}
                      >
                        <TableCell colSpan={1} align="left">
                          <b>Total</b>
                        </TableCell>
                        <TableCell align="center" />
                        <TableCell align="center" />
                        <TableCell align="center">
                          <b>{totalRow?.sessionLength.toFixed(1)}</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>{totalRow?.rotations}</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>{totalRow?.distance.toFixed(2)}</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>-</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>-</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>-</b>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </>
              );
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
              <Typography variant="subtitle1" sx={{ ml: 1, mr: 2 }}>
                {day}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
