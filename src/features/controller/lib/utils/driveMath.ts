import { JoyStickPosition } from "../interface/joystick";

export function calculatePackedDrive(positions: JoyStickPosition): number {
  const { x, y } = positions;

  const throttleRaw = Math.round((y + 1.0) * 1000);
  const steeringRaw = Math.round((x + 1.0) * 1000);

  const clampedThrottle = Math.max(0, Math.min(2000, throttleRaw));
  const clampedSteering = Math.max(0, Math.min(2000, steeringRaw));

  return clampedThrottle * 3000 + clampedSteering;
}

export const DRIVE_STOP_VALUE = 3001000;
