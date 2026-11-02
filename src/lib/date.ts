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

const BULLETIN_MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function bulletinMonthKey(title: string | undefined): number | null {
  if (!title) return null;
  const monthExpression = BULLETIN_MONTHS.map((month) => `${month.slice(0, 3)}(?:${month.slice(3)})?`).join("|");
  const match = new RegExp(`\\b(${monthExpression})\\.?\\s+(20\\d{2})\\b`, "i").exec(title);
  if (!match) return null;
  const month = BULLETIN_MONTHS.findIndex((value) => value.startsWith(match[1].toLowerCase().replace(/\.$/, "")));
  return month < 0 ? null : Number(match[2]) * 12 + month;
}

/** Sort bulletin titles chronologically from the newest issue to the oldest. */
export function sortBulletins<T extends { title?: string }>(rows: T[]): T[] {
  return rows
    .map((row, index) => ({ row, index, monthKey: bulletinMonthKey(row.title) }))
    .sort((a, b) => {
      if (a.monthKey === null && b.monthKey !== null) return 1;
      if (a.monthKey !== null && b.monthKey === null) return -1;
      if (a.monthKey !== null && b.monthKey !== null && a.monthKey !== b.monthKey) {
        return b.monthKey - a.monthKey;
      }
      return a.index - b.index;
    })
    .map(({ row }) => row);
}
