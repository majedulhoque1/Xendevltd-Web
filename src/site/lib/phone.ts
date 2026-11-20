// Phone check for the enquiry form (DEVIATIONS.md C3): a Bangladeshi mobile
// (01XXXXXXXXX, with or without +880 / 880) or an international number starting with +.
export function isValidPhone(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  if (!/^[+\d][\d\s\-().]*$/.test(s)) return false;
  const digits = s.replace(/\D/g, "");
  const bd = digits.replace(/^(?:00)?880/, "0");
  if (/^01[3-9]\d{8}$/.test(bd)) return true;
  return s.startsWith("+") && digits.length >= 8 && digits.length <= 15;
}

/** Today in the visitor's timezone as YYYY-MM-DD, for <input type="date" min>. */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
