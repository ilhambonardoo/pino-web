export interface JoystickProps {
  robotIp: string;
  size?: number; // (pixel)
}

export interface JoyStickPosition {
  x: number; // steering (Kiri Kanan)
  y: number; // throttle (Mundur Maju)
}
