export const esphomeApi = {
  async sendDrive(robotIp: string, packedValue: number): Promise<boolean> {
    try {
      const response = await fetch("/api/esphome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "drive",
          robotIp,
          value: packedValue,
        }),
      });
      return response.ok;
    } catch (e) {
      console.error("Error sending drive command:", e);
      return false;
    }
  },

  async pressButton(robotIp: string, buttonId: string): Promise<boolean> {
    try {
      const response = await fetch("/api/esphome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "button",
          robotIp,
          buttonId,
        }),
      });
      return response.ok;
    } catch (e) {
      console.error(`Error pressing button ${buttonId}:`, e);
      return false;
    }
  },
};
