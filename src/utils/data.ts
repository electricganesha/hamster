import { AggregatedSession } from '@/app/types/session';
import { format, isWithinInterval, parseISO, subHours } from 'date-fns';
import { computeDistance } from './computation';

export const aggregateSessionsByDay = (
  sessions: AggregatedSession[],
): { [day: string]: AggregatedSession[] } => {
  const byDay: { [day: string]: AggregatedSession[] } = {};
  sessions.forEach((s) => {
    // Subtract 12 hours from startTime to group by noon-to-noon day
    const noonDay = format(subHours(parseISO(s.startTime), 12), 'yyyy-MM-dd');
    if (!byDay[noonDay]) byDay[noonDay] = [];
    byDay[noonDay].push(s);
  });
  return byDay;
};

export const filterSession = (
  s: AggregatedSession,
  filters: {
    distanceRange: [number, number];
    tempRange: [number, number];
    humidityRange: [number, number];
    dateRange: [Date | null, Date | null];
    rotationRange: [number, number];
    speedRange: [number, number];
  },
): boolean => {
  const dist = s.distance;
  const temp = s.temperature;
  const hum = s.humidity;
  const date = new Date(s.startTime);
  const speed = s.speed;
  const rotations = s.rotations;
  return (
    dist >= filters.distanceRange[0] &&
    dist <= filters.distanceRange[1] &&
    temp >= filters.tempRange[0] &&
    temp <= filters.tempRange[1] &&
    hum >= filters.humidityRange[0] &&
    hum <= filters.humidityRange[1] &&
    rotations >= filters.rotationRange[0] &&
    rotations <= filters.rotationRange[1] &&
    speed >= filters.speedRange[0] &&
    speed <= filters.speedRange[1] &&
    (!filters.dateRange[0] ||
      !filters.dateRange[1] ||
      (date >= filters.dateRange[0] && date <= filters.dateRange[1]))
  );
};

export const filterSessions = (
  sessions: AggregatedSession[],
  filters: {
    distanceRange: [number, number];
    tempRange: [number, number];
    humidityRange: [number, number];
    dateRange: [Date | null, Date | null];
    rotationRange: [number, number];
    speedRange: [number, number];
  },
) => {
  return sessions.filter((s) => {
    const dist = computeDistance(s.rotations);
    const temp = s.temperature;
    const hum = s.humidity;
    const date = parseISO(s.startTime);
    const speed = s.speed;
    const rotations = s.rotations;
    return (
      dist >= filters.distanceRange[0] &&
      dist <= filters.distanceRange[1] &&
      temp >= filters.tempRange[0] &&
      temp <= filters.tempRange[1] &&
      hum >= filters.humidityRange[0] &&
      hum <= filters.humidityRange[1] &&
      rotations >= filters.rotationRange[0] &&
      rotations <= filters.rotationRange[1] &&
      speed >= filters.speedRange[0] &&
      speed <= filters.speedRange[1] &&
      (!filters.dateRange[0] ||
        !filters.dateRange[1] ||
        isWithinInterval(date, { start: filters.dateRange[0], end: filters.dateRange[1] }))
    );
  });
};

export const getChartData = (byDay: Record<string, AggregatedSession[]>) => {
  const days = Object.keys(byDay).sort((a, b) => a.localeCompare(b));
  return {
    days,
    distance: days.map((d) =>
      byDay[d].reduce((sum: number, s: AggregatedSession) => sum + s.distance, 0),
    ),
    rotations: days.map((d) =>
      byDay[d].reduce((sum: number, s: AggregatedSession) => sum + s.rotations, 0),
    ),
    sessionLength: days.map(
      (d) =>
        byDay[d].reduce(
          (sum: number, s: AggregatedSession) =>
            sum + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000,
          0,
        ) / byDay[d].length,
    ),
    speed: days.map((d) => {
      const totalDistance = byDay[d].reduce(
        (sum: number, s: AggregatedSession) => sum + s.distance,
        0,
      );
      const totalDuration = byDay[d].reduce((sum: number, s: AggregatedSession) => {
        const start = new Date(s.startTime).getTime() / 1000;
        const end = new Date(s.endTime).getTime() / 1000;
        return sum + Math.max(0, end - start);
      }, 0);
      // Use the same formula as utils: speed in km/h
      return totalDuration > 0 ? (totalDistance / totalDuration) * 3600 : 0;
    }),
    avgTemp: days.map(
      (d) =>
        byDay[d].reduce((sum: number, s: AggregatedSession) => sum + s.temperature, 0) /
        byDay[d].length,
    ),
    avgHumidity: days.map(
      (d) =>
        byDay[d].reduce((sum: number, s: AggregatedSession) => sum + s.humidity, 0) /
        byDay[d].length,
    ),
  };
};
