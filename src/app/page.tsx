"use client";

import { useState } from "react";
import { Joystick } from "@/src/features/controller/components/Joystick";
import { ExpressionGrid } from "@/src/features/expressions/components/ExpressionGrid";
import { esphomeApi } from "@/src/services/esphomeApi";

export default function Home() {
  const [robotIp, setRobotIp] = useState<string>("192.168.1.100");
  const [isIpSaved, setIsIpSaved] = useState<boolean>(false);

  const handleEmergencyStop = async () => {
    await esphomeApi.pressButton(robotIp, "pino_button_stop");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">
            PINO V8 Controller
          </h1>
          <p className="text-xs text-slate-400">
            Web Dashboard Control & Expression Panel
          </p>
        </div>

        {/* IP Address Configuration */}
        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 font-mono">IP:</span>
          <input
            type="text"
            value={robotIp}
            onChange={(e) => setRobotIp(e.target.value)}
            disabled={isIpSaved}
            placeholder="e.g. 192.168.1.100"
            className="bg-slate-800 text-xs text-white px-2 py-1 rounded outline-none border border-slate-700 w-36 font-mono disabled:opacity-50"
          />
          <button
            onClick={() => setIsIpSaved(!isIpSaved)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded border border-slate-700 font-medium"
          >
            {isIpSaved ? "Edit" : "Save"}
          </button>
        </div>
      </header>

      {/* Control Panel Area */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Joystick & Emergency Stop */}
        <section className="flex flex-col items-center gap-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Drive Control
          </h2>

          <Joystick robotIp={robotIp} size={220} />

          {/* Emergency Stop Button */}
          <button
            onClick={handleEmergencyStop}
            className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold rounded-lg shadow-lg tracking-wider transition-all"
          >
            🚨 EMERGENCY STOP
          </button>
        </section>

        {/* Right Column: Expression Buttons */}
        <section className="flex justify-center">
          <ExpressionGrid robotIp={robotIp} />
        </section>
      </div>
    </main>
  );
}
