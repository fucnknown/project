import { DateSampleTest } from '../types';

/**
 * Validates if a locale string is accepted by Intl
 */
export function isValidLocale(locale: string): boolean {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0;
  } catch {
    return false;
  }
}

/**
 * Validates if an IANA timezone identifier is valid
 */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns human-readable label for a locale
 */
export function getLocaleDisplayName(locale: string): string {
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
    return displayNames.of(locale) || locale;
  } catch {
    return locale;
  }
}

/**
 * Extract ISO / RFC date strings found in text in strict chronological order
 */
export function extractChronologicalDates(text: string): string[] {
  // Regex for ISO-like strings: YYYY-MM-DDTHH:mm:ss(Z|±HH:mm) or YYYY-MM-DD
  const isoRegex = /\b\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?\b/g;
  const matches = text.match(isoRegex) || [];
  // Keep unique in original chronological order of appearance
  const seen = new Set<string>();
  const results: string[] = [];
  for (const m of matches) {
    if (!seen.has(m)) {
      seen.add(m);
      results.push(m);
      if (results.length >= 8) break; // Keep manageable preview
    }
  }
  return results;
}

/**
 * Generates sample date formatting comparison
 */
export function evaluateDateFormatting(
  dates: string[],
  targetLocale: string,
  targetTimeZone: string,
  originalLocale = 'en-US',
  originalTimeZone = 'UTC'
): { tests: DateSampleTest[]; isChronological: boolean } {
  const fallbackDates = [
    '2026-09-22T08:15:30Z',
    '2026-09-22T10:45:12Z',
    '2026-09-22T14:30:00Z',
    '2026-09-22T18:05:44Z',
  ];

  const dateList = dates.length > 0 ? dates : fallbackDates;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  let origFormatter: Intl.DateTimeFormat | null = null;
  try {
    origFormatter = new Intl.DateTimeFormat(originalLocale, { ...options, timeZone: originalTimeZone });
  } catch {
    origFormatter = null;
  }

  let modFormatter: Intl.DateTimeFormat | null = null;
  try {
    modFormatter = new Intl.DateTimeFormat(targetLocale, { ...options, timeZone: targetTimeZone });
  } catch {
    modFormatter = null;
  }

  let isChronological = true;
  let previousTimestamp = -Infinity;

  const tests: DateSampleTest[] = dateList.map((iso, idx) => {
    const d = new Date(iso);
    const validDate = !isNaN(d.getTime());
    const ts = validDate ? d.getTime() : 0;

    if (validDate) {
      if (ts < previousTimestamp) {
        isChronological = false;
      }
      previousTimestamp = ts;
    }

    let origStr = 'Invalid Date';
    let modStr = 'Invalid Date';

    if (validDate) {
      origStr = origFormatter ? origFormatter.format(d) : d.toLocaleString();
      modStr = modFormatter ? modFormatter.format(d) : d.toLocaleString();
    }

    return {
      isoString: iso,
      label: `Event Timestamp #${idx + 1}`,
      formattedOriginal: origStr,
      formattedModified: modStr,
    };
  });

  return { tests, isChronological };
}
