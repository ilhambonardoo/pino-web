"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRobotDrive } from "../hooks/useRobotDrive";
import { JoystickProps } from "../lib/interface/joystick";

export const Joystick: React.FC<JoystickProps> = ({ robotIp, size = 200 }) => {
  const { updateJoystick, startDriveLoop, stopDriveLoop } =
    useRobotDrive(robotIp);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const maxRadius = rect.width / 2 - 38;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;

      const distance = Math.hypot(deltaX, deltaY);

      if (distance > maxRadius) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * maxRadius;
        deltaY = Math.sin(angle) * maxRadius;
      }

      setPosition({ x: deltaX, y: deltaY });

      const normalizedX = Number((deltaX / maxRadius).toFixed(2));
      const normalizedY = Number((-deltaY / maxRadius).toFixed(2));

      updateJoystick({ x: normalizedX, y: normalizedY });
    },
    [updateJoystick],
  );

  const handleStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    startDriveLoop();
    handleMove(e.clientX, e.clientY);
  };

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    stopDriveLoop();
  }, [stopDriveLoop]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) handleMove(e.clientX, e.clientY);
    };

    const onPointerUp = () => {
      if (isDragging) handleEnd();
    };

    if (isDragging) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [isDragging, handleMove, handleEnd]);
  return (
    <div className="flex w-full flex-col items-center gap-4 select-none">
      <div className="flex w-full items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span>Manual drive</span>
        <span
          className={`flex items-center gap-1.5 ${isDragging ? "text-cyan-300" : "text-slate-500"}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${isDragging ? "bg-cyan-300 shadow-[0_0_10px_#67e8f9]" : "bg-slate-600"}`}
          />
          {isDragging ? "Active" : "Standby"}
        </span>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handleStart}
        style={{ width: `min(${size}px, 78vw)`, aspectRatio: "1" }}
        className="group relative flex shrink-0 cursor-pointer touch-none items-center justify-center rounded-full border border-cyan-300/15 bg-[#101c2c] shadow-[0_22px_45px_-18px_rgba(0,0,0,0.9),inset_0_2px_5px_rgba(255,255,255,0.08)]"
      >
        <div className="absolute inset-[7%] rounded-full border border-slate-500/20" />
        <div className="absolute inset-[18%] rounded-full border border-slate-500/15" />
        <div className="absolute inset-[29%] rounded-full border border-slate-500/10" />
        <div className="absolute inset-x-[14%] top-1/2 h-px bg-cyan-100/10" />
        <div className="absolute inset-y-[14%] left-1/2 w-px bg-cyan-100/10" />
        <span className="absolute top-[9%] text-[9px] font-bold tracking-[0.3em] text-slate-500">
          FWD
        </span>
        <span className="absolute bottom-[9%] text-[9px] font-bold tracking-[0.3em] text-slate-600">
          REV
        </span>
        <span className="absolute left-[10%] text-[9px] font-bold tracking-[0.3em] text-slate-600">
          L
        </span>
        <span className="absolute right-[10%] text-[9px] font-bold tracking-[0.3em] text-slate-600">
          R
        </span>

        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className={`relative z-10 flex h-[28%] w-[28%] items-center justify-center rounded-full border border-cyan-100/30 bg-gradient-to-br from-cyan-300 via-sky-500 to-blue-700 shadow-[0_10px_25px_-5px_rgba(14,165,233,0.75),inset_0_2px_4px_rgba(255,255,255,0.65)] ${
            isDragging ? "scale-110" : ""
          }`}
        >
          <span className="h-[34%] w-[34%] rounded-full bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.65)]" />
        </div>
      </div>

      <span className="rounded-full border border-slate-700/80 bg-slate-950/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {isDragging ? "Driving robot" : "Touch to drive"}
      </span>
    </div>
  );
};
