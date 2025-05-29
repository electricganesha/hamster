import { AggregatedSession } from '@/app/types/session';
import { getSessionAverages, getSessionLengthMinutes, getSessionTotals } from '@/utils/session';
import { Box, Paper, styled, Typography, useTheme } from '@mui/material';
import { FC, useMemo } from 'react';

const MIN_DISTANCE = 0.01;

interface GeneralStatsProps {
  sessions: AggregatedSession[];
}

export const GeneralStats: FC<GeneralStatsProps> = ({ sessions }) => {
  const overallTotals = useMemo(() => getSessionTotals(sessions), [sessions]);
  const overallAverages = useMemo(() => getSessionAverages(sessions), [sessions]);
  const nonZeroDistances = useMemo(
    () => sessions.map((s) => s.distance).filter((d) => d > MIN_DISTANCE),
    [sessions],
  );
  const minDistance = useMemo(
    () => (nonZeroDistances.length ? Math.min(...nonZeroDistances) : null),
    [nonZeroDistances],
  );
  const maxDistance = useMemo(
    () => (nonZeroDistances.length ? Math.max(...nonZeroDistances) : null),
    [nonZeroDistances],
  );
  const fastestSession = useMemo(
    () => (sessions.length ? Math.max(...sessions.map((s) => s.speed)) : null),
    [sessions],
  );
  const slowestSession = useMemo(
    () => (sessions.length ? Math.min(...sessions.map((s) => s.speed)) : null),
    [sessions],
  );
  const shortestSession = useMemo(
    () => (sessions.length ? Math.min(...sessions.map((s) => getSessionLengthMinutes(s))) : null),
    [sessions],
  );
  const longestSession = useMemo(
    () => (sessions.length ? Math.max(...sessions.map((s) => getSessionLengthMinutes(s))) : null),
    [sessions],
  );

  const theme = useTheme();

  return (
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
          <GeneralStatsPill>
            Tot. Session:{' '}
            <b>
              <br />
              {overallTotals?.sessionLength?.toFixed(1) ?? '-'}
            </b>{' '}
            min
          </GeneralStatsPill>
          <GeneralStatsPill>
            Tot. Rotations:{' '}
            <b>
              <br />
              {overallTotals?.rotations ?? '-'}
            </b>
          </GeneralStatsPill>
          <GeneralStatsPill>
            Tot. Distance:{' '}
            <b>
              <br />
              {overallTotals?.distance?.toFixed(2) ?? '-'}
            </b>{' '}
            km
          </GeneralStatsPill>
          <GeneralStatsPill>
            Avg. Session:{' '}
            <b>
              <br />
              {overallAverages?.sessionLength?.toFixed(1) ?? '-'}
            </b>{' '}
            min
          </GeneralStatsPill>
          <GeneralStatsPill>
            Avg. Rotations:{' '}
            <b>
              {' '}
              <br />
              {overallAverages?.rotations?.toFixed(0) ?? '-'}
            </b>
          </GeneralStatsPill>
          <GeneralStatsPill>
            Avg. Distance:{' '}
            <b>
              {' '}
              <br />
              {overallAverages?.distance?.toFixed(2) ?? '-'}
            </b>{' '}
            km
          </GeneralStatsPill>
          <GeneralStatsPill>
            Avg. Speed:{' '}
            <b>
              {' '}
              <br />
              {overallAverages?.speed?.toFixed(2) ?? '-'}
            </b>{' '}
            km/h
          </GeneralStatsPill>
          <GeneralStatsPill>
            Avg. Temp:{' '}
            <b>
              {' '}
              <br />
              {overallAverages?.temperature?.toFixed(1) ?? '-'}
            </b>{' '}
            °C
          </GeneralStatsPill>
          <GeneralStatsPill>
            Avg. Humidity:{' '}
            <b>
              {' '}
              <br />
              {overallAverages?.humidity?.toFixed(1) ?? '-'}
            </b>{' '}
            %
          </GeneralStatsPill>
          <GeneralStatsPill>
            Min Distance:{' '}
            <b>
              {' '}
              <br />
              {minDistance !== null ? minDistance.toFixed(2) : '-'}
            </b>{' '}
            km
          </GeneralStatsPill>
          <GeneralStatsPill>
            Max Distance:{' '}
            <b>
              {' '}
              <br />
              {maxDistance !== null ? maxDistance.toFixed(2) : '-'}
            </b>{' '}
            km
          </GeneralStatsPill>
          <GeneralStatsPill>
            Fastest Session:{' '}
            <b>
              {' '}
              <br />
              {fastestSession !== null ? fastestSession.toFixed(2) : '-'}
            </b>{' '}
            km/h
          </GeneralStatsPill>
          <GeneralStatsPill>
            Slowest Session:{' '}
            <b>
              {' '}
              <br />
              {slowestSession !== null ? slowestSession.toFixed(2) : '-'}
            </b>{' '}
            km/h
          </GeneralStatsPill>
          <GeneralStatsPill>
            Shortest Session:{' '}
            <b>
              {' '}
              <br />
              {shortestSession !== null ? shortestSession.toFixed(1) : '-'}
            </b>{' '}
            min
          </GeneralStatsPill>
          <GeneralStatsPill>
            Longest Session:{' '}
            <b>
              {' '}
              <br />
              {longestSession !== null ? longestSession.toFixed(1) : '-'}
            </b>{' '}
            min
          </GeneralStatsPill>
        </Box>
      </Paper>
    </Box>
  );
};

const GeneralStatsPill = styled(Typography)(({ theme }) => ({
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
