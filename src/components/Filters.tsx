import { Grid, Typography, Slider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface FiltersProps {
  distanceRange: [number, number];
  setDistanceRange: (v: [number, number]) => void;
  tempRange: [number, number];
  setTempRange: (v: [number, number]) => void;
  humidityRange: [number, number];
  setHumidityRange: (v: [number, number]) => void;
  dateRange: [Date | null, Date | null];
  setDateRange: (v: [Date | null, Date | null]) => void;
}

export const Filters = ({
  distanceRange,
  setDistanceRange,
  tempRange,
  setTempRange,
  humidityRange,
  setHumidityRange,
  dateRange,
  setDateRange,
}: FiltersProps) => {
  return (
    <Grid container spacing={8} sx={{ padding: '2px 24px' }}>
      <Grid>
        <Typography gutterBottom>Distance (m)</Typography>
        <Slider
          value={distanceRange}
          onChange={(_, v) => setDistanceRange(v as [number, number])}
          min={0}
          max={1000}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>
      <Grid>
        <Typography gutterBottom>Temperature (°C)</Typography>
        <Slider
          value={tempRange}
          onChange={(_, v) => setTempRange(v as [number, number])}
          min={0}
          max={40}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>
      <Grid>
        <Typography gutterBottom>Humidity (%)</Typography>
        <Slider
          value={humidityRange}
          onChange={(_, v) => setHumidityRange(v as [number, number])}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>
      <Grid>
        <Typography gutterBottom>Date Range</Typography>
        <DatePicker
          label="Start"
          value={dateRange[0]}
          onChange={(v) => setDateRange([v, dateRange[1]])}
          sx={{ mr: 1 }}
        />
        <DatePicker
          label="End"
          value={dateRange[1]}
          onChange={(v) => setDateRange([dateRange[0], v])}
        />
      </Grid>
    </Grid>
  );
};
