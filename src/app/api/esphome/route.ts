import { NextResponse } from "next/server";

type EsphomeRequest =
  | { action: "drive"; robotIp: string; value: number }
  | { action: "button"; robotIp: string; buttonId: string };

const buttonNames: Record<string, string> = {
  pino_button_happy: "Pino Senang",
  pino_button_love: "Pino Love",
  pino_button_surprised: "Pino Kaget",
  pino_button_angry: "Pino Marah",
  pino_button_dizzy: "Pino Pusing",
  pino_button_wink: "Pino Kedip",
  pino_button_curious: "Pino Penasaran",
  pino_button_celebrate: "Pino Rayakan",
  pino_button_sad: "Pino Sedih",
  pino_button_scared: "Pino Takut",
  pino_button_sleepy: "Pino Ngantuks",
  pino_button_sleep: "Pino Tidur",
  pino_button_stop: "Pino Stop",
};

function getRobotUrl(robotIp: string, path: string) {
  const host = robotIp
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  if (!host || /[^a-zA-Z0-9.:-]/.test(host)) {
    throw new Error("Invalid robot IP or hostname");
  }

  return `http://${host}${path}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EsphomeRequest;
    const targetUrl =
      body.action === "drive"
        ? getRobotUrl(
            body.robotIp,
            `/number/Pino%20Drive/set?value=${encodeURIComponent(body.value)}`,
          )
        : getRobotUrl(
            body.robotIp,
            `/button/${encodeURIComponent(buttonNames[body.buttonId] ?? body.buttonId)}/press`,
          );

    const response = await fetch(targetUrl, {
      method: "POST",
      body: "",
      headers: { "Content-Length": "0" },
      signal: AbortSignal.timeout(5000),
    });

    return NextResponse.json(
      { ok: response.ok },
      { status: response.ok ? 200 : response.status },
    );
  } catch (error) {
    console.error("Error forwarding ESPHome command:", error);
    return NextResponse.json(
      { ok: false, error: "Could not connect to ESPHome device" },
      { status: 502 },
    );
  }
}
