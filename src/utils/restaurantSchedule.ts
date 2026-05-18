// Parses "HH:MM" into total minutes since midnight.
function toMinutes(hh: string, mm: string): number {
  return parseInt(hh, 10) * 60 + parseInt(mm, 10);
}

const HOUR_RANGE_RE = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/;

/**
 * Returns true if the current time falls within the restaurant's operating hours.
 * Supports midnight-crossing ranges (e.g. "22:00-02:00").
 * Returns false for missing or malformed hour strings.
 */
export function isRestaurantOpenNow(hour: string | undefined | null, now: Date = new Date()): boolean {
  if (!hour?.trim()) return false;
  const match = hour.trim().match(HOUR_RANGE_RE);
  if (!match) return false;

  const open = toMinutes(match[1], match[2]);
  const close = toMinutes(match[3], match[4]);
  const current = now.getHours() * 60 + now.getMinutes();

  // Midnight crossing: e.g. open=22:00 (1320), close=02:00 (120)
  if (close <= open) {
    return current >= open || current < close;
  }
  return current >= open && current < close;
}

/**
 * Returns a display label and boolean for the restaurant's current open status.
 * Uses the device clock and the restaurant's hour field.
 */
export function getOpenStatusLabel(hour: string | undefined | null): {
  label: string;
  isOpen: boolean;
} {
  if (!hour?.trim() || !HOUR_RANGE_RE.test(hour.trim())) {
    return { label: 'Horario no disponible', isOpen: false };
  }
  const isOpen = isRestaurantOpenNow(hour);
  return { label: isOpen ? 'Abierto' : 'Cerrado', isOpen };
}
