const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" };

function parseDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string") {
    const dateOnly = DATE_ONLY.exec(value.trim());
    // Treat date-only values as calendar dates, avoiding timezone day shifts.
    const parsed = dateOnly
      ? new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]), 12))
      : new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(value: string | number | Date | null | undefined): string {
  const date = parseDate(value);
  if (!date) return typeof value === "string" ? value : "";
  return new Intl.DateTimeFormat("en-NG", DATE_OPTIONS).format(date);
}

export function formatDateTime(value: string | number | Date | null | undefined): string {
  const date = parseDate(value);
  if (!date) return typeof value === "string" ? value : "";
  return new Intl.DateTimeFormat("en-NG", {
    ...DATE_OPTIONS, hour: "numeric", minute: "2-digit", hourCycle: "h12",
  }).format(date);
}
