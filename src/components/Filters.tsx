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
  rotationRange: [number, number];
  setRotationRange: (v: [number, number]) => void;
  speedRange: [number, number];
  setSpeedRange: (v: [number, number]) => void;
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
  rotationRange,
  setRotationRange,
  speedRange,
  setSpeedRange,
}: FiltersProps) => {
  return (
    <Grid container spacing={{ xs: 2, sm: 4 }} sx={{ padding: { xs: '2px 4px', sm: '2px 24px' } }}>
      <Grid
        spacing={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Typography gutterBottom>Distance (km)</Typography>
        <Slider
          value={distanceRange}
          onChange={(_, v) => setDistanceRange(v as [number, number])}
          min={0}
          max={6}
          step={0.1}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>
      <Grid
        spacing={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Typography gutterBottom>Rotations</Typography>
        <Slider
          value={rotationRange}
          onChange={(_, v) => setRotationRange(v as [number, number])}
          min={0}
          max={5000}
          step={100}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>
      <Grid
        spacing={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Typography gutterBottom>Speed (km/h)</Typography>
        <Slider
          value={speedRange}
          onChange={(_, v) => setSpeedRange(v as [number, number])}
          min={0}
          max={5}
          step={0.1}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>
      <Grid
        spacing={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
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
      <Grid
        spacing={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
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
      <Grid
        spacing={{ xs: 12, sm: 6, md: 3 }}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <DatePicker
          label="Start"
          value={dateRange[0]}
          onChange={(v) => setDateRange([v, dateRange[1]])}
          sx={{ width: '100%' }}
        />
        <DatePicker
          label="End"
          value={dateRange[1]}
          onChange={(v) => setDateRange([dateRange[0], v])}
          sx={{ width: '100%' }}
        />
      </Grid>
    </Grid>
  );
};
