import { Typography, Slider, Button, styled, Grid, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useEffect } from 'react';

const DAYS_IN_MONTH = 30;
const DAYS_IN_FORTNIGHT = 14;
const DAYS_IN_WEEK = 7;
const DAYS_IN_DAY = 1;

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
  // Reset filters when date range changes
  useEffect(() => {
    if (dateRange[0] || dateRange[1]) {
      setDistanceRange([0, 6]);
      setTempRange([0, 40]);
      setHumidityRange([0, 100]);
      setRotationRange([0, 5000]);
      setSpeedRange([0, 5]);
    }
  }, [
    dateRange,
    setDistanceRange,
    setTempRange,
    setHumidityRange,
    setRotationRange,
    setSpeedRange,
  ]);

  useEffect(() => {
    setDate(new Date().getDate() - 29);
  }, []);

  const setDate = useCallback((date: number) => {
    const now = new Date();
    const start = new Date();
    start.setDate(date);
    setDateRange([start, now]);
  }, []);

  return (
    <Grid container spacing={2} sx={{ padding: { xs: '2px 4px', sm: '2px 24px' } }} gap={4}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        wrap="wrap"
        justifyContent="space-between"
        flexDirection="row"
        width="100%"
        gap={2}
      >
        <Filter>
          <DatePicker
            label="Start"
            value={dateRange[0]}
            onChange={(v) => setDateRange([v, dateRange[1]])}
            sx={{ width: { xs: '100%', sm: '180px' } }}
          />
        </Filter>
        <Filter>
          <DatePicker
            label="End"
            value={dateRange[1]}
            onChange={(v) => setDateRange([dateRange[0], v])}
            sx={{ width: { xs: '100%', sm: '180px' } }}
          />
        </Filter>
        <Filter>
          <FilterButton fullWidth variant="contained" onClick={() => setDateRange([null, null])}>
            All Time
          </FilterButton>
        </Filter>
        <Filter>
          <FilterButton
            fullWidth
            variant="contained"
            onClick={() => setDate(new Date().getDate() - DAYS_IN_MONTH)}
          >
            30 Days
          </FilterButton>
        </Filter>
        <Filter>
          <FilterButton
            fullWidth
            variant="contained"
            onClick={() => setDate(new Date().getDate() - DAYS_IN_FORTNIGHT)}
          >
            15 Days
          </FilterButton>
        </Filter>
        <Filter>
          <FilterButton
            fullWidth
            variant="contained"
            onClick={() => setDate(new Date().getDate() - DAYS_IN_WEEK)}
          >
            Week
          </FilterButton>
        </Filter>
        <Filter>
          <FilterButton
            fullWidth
            variant="contained"
            onClick={() => setDate(new Date().getDate() - DAYS_IN_DAY)}
          >
            Day
          </FilterButton>
        </Filter>
      </Grid>
      <Divider sx={{ width: '100%' }} />
      <Grid
        container
        spacing={2}
        alignItems="center"
        wrap="wrap"
        justifyContent="space-evenly"
        flexDirection="row"
        width="100%"
        gap={8}
      >
        <Filter>
          <Typography gutterBottom fontSize={12}>
            Distance (km)
          </Typography>
          <Slider
            value={distanceRange}
            onChange={(_, v) => setDistanceRange(v as [number, number])}
            min={0}
            max={6}
            step={0.1}
            valueLabelDisplay="auto"
            size="small"
            sx={{ width: '100%' }}
          />
        </Filter>
        <Filter>
          <Typography gutterBottom fontSize={12}>
            Rotations
          </Typography>
          <Slider
            value={rotationRange}
            onChange={(_, v) => setRotationRange(v as [number, number])}
            min={0}
            max={5000}
            step={100}
            valueLabelDisplay="auto"
            size="small"
            sx={{ width: '100%' }}
          />
        </Filter>
        <Filter>
          <Typography gutterBottom fontSize={12}>
            Speed (km/h)
          </Typography>
          <Slider
            value={speedRange}
            onChange={(_, v) => setSpeedRange(v as [number, number])}
            min={0}
            max={5}
            step={0.1}
            valueLabelDisplay="auto"
            size="small"
            sx={{ width: '100%' }}
          />
        </Filter>
        <Filter>
          <Typography gutterBottom fontSize={12}>
            Temperature (°C)
          </Typography>
          <Slider
            value={tempRange}
            onChange={(_, v) => setTempRange(v as [number, number])}
            min={0}
            max={40}
            valueLabelDisplay="auto"
            size="small"
            sx={{ width: '100%' }}
          />
        </Filter>
        <Filter>
          <Typography gutterBottom fontSize={12}>
            Humidity (%)
          </Typography>
          <Slider
            value={humidityRange}
            onChange={(_, v) => setHumidityRange(v as [number, number])}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            size="small"
            sx={{ width: '100%' }}
          />
        </Filter>
      </Grid>
    </Grid>
  );
};

const FilterButton = styled(Button)(({ theme }) => ({
  width: '92px !important',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const Filter = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: '24px',
  maxWidth: '12%',
  backgroundColor: theme.palette.background.paper,
}));
