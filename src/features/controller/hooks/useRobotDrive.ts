// src/features/controller/hooks/useRobotDrive.ts

import { useRef, useCallback } from "react";

import { esphomeApi } from "@/src/services/esphomeApi";
import { calculatePackedDrive, DRIVE_STOP_VALUE } from "../lib/utils/driveMath";
import { JoyStickPosition } from "../lib/interface/joystick";

export function useRobotDrive(robotIp: string) {
  const currentPackedVal = useRef<number>(DRIVE_STOP_VALUE);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startDriveLoop = useCallback(() => {
    if (intervalRef.current !== null) return;

    // Kirim request HTTP POST setiap 100ms
    intervalRef.current = setInterval(() => {
      if (robotIp) {
        esphomeApi.sendDrive(robotIp, currentPackedVal.current);
      }
    }, 100);
  }, [robotIp]);

  const stopDriveLoop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    currentPackedVal.current = DRIVE_STOP_VALUE;
    if (robotIp) {
      esphomeApi.sendDrive(robotIp, DRIVE_STOP_VALUE);
    }
  }, [robotIp]);

  const updateJoystick = useCallback((position: JoyStickPosition) => {
    currentPackedVal.current = calculatePackedDrive(position);
  }, []);

  return {
    updateJoystick,
    startDriveLoop,
    stopDriveLoop,
  };
}
