export function generateDaySlots(startTime: string, endTime: string, slotMinutes: number): string[] {
  if (!startTime || !endTime || slotMinutes <= 0) return [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const slots: string[] = [];
  for (let t = startMin; t + slotMinutes <= endMin; t += slotMinutes) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}
