import { AggregatedSession } from '@/app/types/session';

export const getSortedSessions = (sessions: AggregatedSession[]) => {
  return [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );
};

export const getSessionLengthMinutes = (session: AggregatedSession) => {
  return (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000;
};

export const getSessionAverages = (sessions: AggregatedSession[]) => {
  const total = sessions.length;
  if (total === 0) return null;
  return {
    rotations: sessions.reduce((sum, s) => sum + s.rotations, 0) / total,
    distance: sessions.reduce((sum, s) => sum + s.distance, 0) / total,
    speed: sessions.reduce((sum, s) => sum + s.speed, 0) / total,
    temperature: sessions.reduce((sum, s) => sum + s.temperature, 0) / total,
    humidity: sessions.reduce((sum, s) => sum + s.humidity, 0) / total,
    sessionLength: sessions.reduce((sum, s) => sum + getSessionLengthMinutes(s), 0) / total,
  };
};

export const getSessionTotals = (sessions: AggregatedSession[]) => {
  const total = sessions.length;
  if (total === 0) return null;
  return {
    rotations: sessions.reduce((sum, s) => sum + s.rotations, 0),
    distance: sessions.reduce((sum, s) => sum + s.distance, 0),
    speed: sessions.reduce((sum, s) => sum + s.speed, 0),
    temperature: sessions.reduce((sum, s) => sum + s.temperature, 0),
    humidity: sessions.reduce((sum, s) => sum + s.humidity, 0),
    sessionLength: sessions.reduce((sum, s) => sum + getSessionLengthMinutes(s), 0),
  };
};
