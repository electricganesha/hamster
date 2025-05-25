import { Paper, Typography, useTheme, useMediaQuery, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

export function ProgressCharts({ chartData }: { chartData: any }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Paper sx={{ p: 2, mb: 2, width: '100%', maxWidth: '100vw', overflowX: 'auto' }}>
      <Typography variant="h6">Progress Charts</Typography>
      <Box sx={{ minWidth: isMobile ? '100%' : 0 }}>
        <LineChart
          height={300}
          series={[
            { data: chartData.distance, label: 'Distance (m)' },
            { data: chartData.avgTemp, label: 'Avg Temp (°C)' },
            { data: chartData.avgHumidity, label: 'Avg Humidity (%)' },
          ]}
          xAxis={[{ scaleType: 'point', data: chartData.days }]}
        />
      </Box>
    </Paper>
  );
}
