import { AggregatedSession, Session } from '@/app/types/session';
import { format, parseISO } from 'date-fns';

// Circumference = π × diameter (28 = 0.28m)
export const WHEEL_DIAMETER_M = 0.28;
export const WHEEL_CIRCUMFERENCE_M = Math.PI * WHEEL_DIAMETER_M;

/**
 * Computes the distance in meters for a given number of wheel rotations.
 * @param rotations Number of wheel rotations
 * @returns Distance in meters
 */
export const computeDistance = (rotations: number) => {
  return rotations * WHEEL_CIRCUMFERENCE_M;
};

export type RotationLogEntry = {
  id: number;
  timestamp: number;
  temperature: number;
  humidity: number;
};

export const computeSessionDerivedFields = (session: Session): AggregatedSession => {
  const log: RotationLogEntry[] = session.rotationLog ?? [];
  const rotations = log.length;
  const distance = computeDistance(rotations);
  const avgTemp = log.length
    ? log.reduce((sum: number, e: RotationLogEntry) => sum + e.temperature, 0) / log.length
    : 0;
  const avgHumidity = log.length
    ? log.reduce((sum: number, e: RotationLogEntry) => sum + e.humidity, 0) / log.length
    : 0;
  const sortedLog = [...log].sort((a, b) => a.timestamp - b.timestamp);
  const startTime = sortedLog.length
    ? new Date(sortedLog[0].timestamp * 1000).toISOString()
    : session.createdAt;
  const endTime = sortedLog.length
    ? new Date(sortedLog[sortedLog.length - 1].timestamp * 1000).toISOString()
    : session.createdAt;
  const durationSeconds =
    sortedLog.length >= 2 ? sortedLog[sortedLog.length - 1].timestamp - sortedLog[0].timestamp : 0;
  const speed = durationSeconds > 0 ? distance / durationSeconds : 0;
  return {
    ...session,
    startTime,
    endTime,
    rotations,
    distance,
    speed,
    temperature: avgTemp,
    humidity: avgHumidity,
    image: session.images && session.images.length > 0 ? session.images[0] : undefined,
  };
};

export const aggregateSessionsByDay = (
  sessions: AggregatedSession[],
): { [day: string]: AggregatedSession[] } => {
  const byDay: { [day: string]: AggregatedSession[] } = {};
  sessions.forEach((s) => {
    const day = format(parseISO(s.startTime), 'yyyy-MM-dd');
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(s);
  });
  return byDay;
};
