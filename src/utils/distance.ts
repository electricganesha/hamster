// Circumference = π × diameter (38cm = 0.38m)
export const WHEEL_DIAMETER_M = 0.38;
export const WHEEL_CIRCUMFERENCE_M = Math.PI * WHEEL_DIAMETER_M;

/**
 * Computes the distance in meters for a given number of wheel rotations.
 * @param rotations Number of wheel rotations
 * @returns Distance in meters
 */
export function computeDistance(rotations: number) {
  return rotations * WHEEL_CIRCUMFERENCE_M;
}
