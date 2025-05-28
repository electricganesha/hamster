import { Paper, Typography, useTheme, useMediaQuery, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { FC } from 'react';

interface ProgressChartsProps {
  chartData: {
    distance: number[];
    rotations: number[];
    speed: number[];
    avgTemp: number[];
    avgHumidity: number[];
    sessionLength: number[];
    days: string[];
  };
}

export const ProgressCharts: FC<ProgressChartsProps> = ({ chartData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Paper sx={{ p: 2, mb: 2, width: '100%', maxWidth: '100vw', overflowX: 'auto' }}>
      <Typography variant="h6">Progress Charts</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minWidth: isMobile ? '100%' : 0,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
          <Box flex={1}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Rotations
            </Typography>
            <LineChart
              height={180}
              grid={{ vertical: true, horizontal: true }}
              series={[{ data: chartData.rotations, label: 'Rotations', color: '#1976d2' }]}
              xAxis={[{ scaleType: 'point', data: chartData.days }]}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Distance
            </Typography>
            <LineChart
              height={180}
              grid={{ vertical: true, horizontal: true }}
              series={[{ data: chartData.distance, label: 'Distance (km)', color: '#43a047' }]}
              xAxis={[{ scaleType: 'point', data: chartData.days }]}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Session Length
            </Typography>
            <LineChart
              height={180}
              grid={{ vertical: true, horizontal: true }}
              series={[
                { data: chartData.sessionLength, label: 'Session Length (min)', color: '#8e24aa' },
              ]}
              xAxis={[{ scaleType: 'point', data: chartData.days }]}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
          <Box flex={1}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Speed
            </Typography>
            <LineChart
              height={180}
              grid={{ vertical: true, horizontal: true }}
              series={[{ data: chartData.speed, label: 'Speed (km/h)', color: '#fbc02d' }]}
              xAxis={[{ scaleType: 'point', data: chartData.days }]}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Avg Temp
            </Typography>
            <LineChart
              height={180}
              grid={{ vertical: true, horizontal: true }}
              series={[{ data: chartData.avgTemp, label: 'Avg Temp (°C)', color: '#e53935' }]}
              xAxis={[{ scaleType: 'point', data: chartData.days }]}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Avg Humidity
            </Typography>
            <LineChart
              height={180}
              grid={{ vertical: true, horizontal: true }}
              series={[
                { data: chartData.avgHumidity, label: 'Avg Humidity (%)', color: '#1e88e5' },
              ]}
              xAxis={[{ scaleType: 'point', data: chartData.days }]}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
