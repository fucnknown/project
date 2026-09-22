export interface ScriptReplacement {
  type: 'locale' | 'timezone';
  originalText: string;
  replacedText: string;
  lineNumber: number;
}

export interface ParsedScript {
  id: number;
  index: number; // chronological order in document
  startTag: string;
  endTag: string;
  originalContent: string;
  modifiedContent: string;
  hasChanges: boolean;
  replacements: ScriptReplacement[];
}

export interface ModificationResult {
  originalHtml: string;
  modifiedHtml: string;
  scripts: ParsedScript[];
  totalScripts: number;
  modifiedScriptsCount: number;
  localeReplacementsCount: number;
  timezoneReplacementsCount: number;
  isChronologicalOrderPreserved: boolean;
}

export interface ModifierConfig {
  targetLocale: string;
  targetTimeZone: string;
  matchAnyLocale: boolean; // if true, replaces any const locale = "..." instead of only "en-US"
  matchAnyTimeZone: boolean; // if true, replaces any timeZone: "..." instead of only "UTC"
}

export interface DateSampleTest {
  isoString: string;
  label: string;
  formattedOriginal: string;
  formattedModified: string;
}
