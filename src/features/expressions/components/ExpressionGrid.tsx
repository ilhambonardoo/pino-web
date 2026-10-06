// src/features/expressions/components/ExpressionGrid.tsx
"use client";

import { esphomeApi } from "@/src/services/esphomeApi";
import React, { useState } from "react";
import { EXPRESSIONS } from "../lib/constant/expression";
import { ExpressionGridProps } from "../lib/interface/expression";

export const ExpressionGrid: React.FC<ExpressionGridProps> = ({ robotIp }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleTriggerExpression = async (buttonId: string) => {
    setActiveId(buttonId);
    await esphomeApi.pressButton(robotIp, buttonId);

    setTimeout(() => {
      setActiveId(null);
    }, 300);
  };

  return (
    <div className="w-full max-w-md p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
        Robot Expressions
      </h3>

      <div className="grid grid-cols-3 gap-2.5">
        {EXPRESSIONS.map((exp) => {
          const isActive = activeId === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => handleTriggerExpression(exp.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg text-white font-medium text-xs transition-all active:scale-95 ${
                exp.color
              } ${isActive ? "ring-2 ring-white scale-95 shadow-lg" : ""}`}
            >
              <span className="text-2xl mb-1">{exp.emoji}</span>
              <span>{exp.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
