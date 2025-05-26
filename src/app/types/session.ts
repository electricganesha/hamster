export type RotationLog = {
  id: number;
  timestamp: number; // Unix timestamp in seconds
  temperature: number; // Temperature in °C
  humidity: number; // Humidity in %
};

export type AggregatedSession = {
  id: string | number;
  createdAt: string;
  images: string[];
  rotationLog: RotationLog[];
  startTime: string;
  endTime: string;
  rotations: number;
  distance: number;
  speed: number; // meters per second
  temperature: number;
  humidity: number;
  image?: string;
};

export type Session = {
  id: string | number;
  createdAt: string;
  images: string[];
  rotationLog: RotationLog[];
};
