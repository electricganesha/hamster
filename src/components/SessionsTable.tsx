import { AggregatedSession } from '@/app/types/session';
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
} from '@mui/material';
import { format, parseISO } from 'date-fns';

export const SessionsTable = ({ sessions }: Readonly<{ sessions: AggregatedSession[] }>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ mb: 2 }}>
        {sessions.map((s) => (
          <Card key={s.id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {format(parseISO(s.startTime), 'yyyy-MM-dd')} |{' '}
                {format(parseISO(s.startTime), 'HH:mm')} - {format(parseISO(s.endTime), 'HH:mm')}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                Rotations: <b>{s.rotations}</b>
              </Typography>
              <Typography variant="body2">
                Distance: <b>{s.distance.toFixed(2)} m</b>
              </Typography>
              <Typography variant="body2">
                Speed: <b>{s.speed.toFixed(2)} m/s</b>
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
      </Stack>
    );
  }

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
            <TableCell>Rotations</TableCell>
            <TableCell>Distance (m)</TableCell>
            <TableCell>Speed (m/s)</TableCell>
            <TableCell>Avg Temp (°C)</TableCell>
            <TableCell>Avg Humidity (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{format(parseISO(s.startTime), 'yyyy-MM-dd')}</TableCell>
              <TableCell>{format(parseISO(s.startTime), 'HH:mm')}</TableCell>
              <TableCell>{format(parseISO(s.endTime), 'HH:mm')}</TableCell>
              <TableCell>{s.rotations}</TableCell>
              <TableCell>{s.distance.toFixed(2)}</TableCell>
              <TableCell>{s.speed.toFixed(2)}</TableCell>
              <TableCell>{s.temperature.toFixed(1)}</TableCell>
              <TableCell>{s.humidity.toFixed(1)}</TableCell>
              <TableCell>
                {s.image ? (
                  <img
                    src={s.image}
                    alt="session"
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
