import { ModifierConfig, ModificationResult, ParsedScript, ScriptReplacement } from '../types';

/**
 * Safely cleans and validates locale and timezone inputs
 */
export function sanitizeLocale(input: string): string {
  return input.trim().replace(/^['"]|['"]$/g, '');
}

export function sanitizeTimeZone(input: string): string {
  // Cleans leading/trailing whitespace, tabs (like in the prompt), quotes
  return input.trim().replace(/^['"]|['"]$/g, '');
}

/**
 * Parses and replaces locale and timezone inside <script> tags
 * while strictly maintaining original chronological order.
 */
export function processHtmlContent(html: string, config: ModifierConfig): ModificationResult {
  const targetLocale = sanitizeLocale(config.targetLocale) || 'es-US';
  const targetTimeZone = sanitizeTimeZone(config.targetTimeZone) || 'America/Argentina/Buenos_Aires';

  // Strict chronological script scanner
  // Matches <script ...>content</script> preserving any attributes
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

  const scripts: ParsedScript[] = [];
  let modifiedHtml = '';
  let lastIndex = 0;
  let scriptCounter = 0;
  let totalLocaleReplacements = 0;
  let totalTimezoneReplacements = 0;

  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    const attributes = match[1];
    const scriptContent = match[2];
    const matchIndex = match.index;

    // Append everything before this script tag verbatim (preserves chronological order of previous tags)
    modifiedHtml += html.slice(lastIndex, matchIndex);

    const startTag = `<script${attributes}>`;
    const endTag = '</script>';

    const replacements: ScriptReplacement[] = [];

    // Construct regexes based on configuration
    // 1. Locale matching:
    // User requested format: const locale = "en-US"
    let localeRegex: RegExp;
    if (config.matchAnyLocale) {
      localeRegex = /(const\s+locale\s*=\s*)(["'])([^"']+)\2/g;
    } else {
      // Matches const locale = "en-US" (with either double or single quotes)
      localeRegex = /(const\s+locale\s*=\s*)(["'])en-US\2/g;
    }

    // 2. Timezone matching:
    // User requested format: timeZone: "UTC"
    let tzRegex: RegExp;
    if (config.matchAnyTimeZone) {
      tzRegex = /(timeZone\s*:\s*)(["'])([^"']+)\2/gi;
    } else {
      // Matches timeZone: "UTC" (case-insensitive UTC, double or single quotes)
      tzRegex = /(timeZone\s*:\s*)(["'])UTC\2/gi;
    }

    // Track replacements line by line
    const lines = scriptContent.split('\n');
    const modifiedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const originalLine = line;
      const lineNumber = i + 1;

      // Check locale replacement on this line
      if (localeRegex.test(line)) {
        localeRegex.lastIndex = 0; // reset
        const replacedLine = line.replace(localeRegex, `$1"${targetLocale}"`);
        if (replacedLine !== line) {
          replacements.push({
            type: 'locale',
            originalText: originalLine.trim(),
            replacedText: replacedLine.trim(),
            lineNumber,
          });
          line = replacedLine;
          totalLocaleReplacements++;
        }
      }

      // Check timezone replacement on this line
      if (tzRegex.test(line)) {
        tzRegex.lastIndex = 0; // reset
        const replacedLine = line.replace(tzRegex, `$1"${targetTimeZone}"`);
        if (replacedLine !== line) {
          replacements.push({
            type: 'timezone',
            originalText: originalLine.trim(),
            replacedText: replacedLine.trim(),
            lineNumber,
          });
          line = replacedLine;
          totalTimezoneReplacements++;
        }
      }

      modifiedLines.push(line);
    }

    const modifiedScriptContent = modifiedLines.join('\n');
    const hasChanges = replacements.length > 0;

    scripts.push({
      id: scriptCounter,
      index: scriptCounter + 1,
      startTag,
      endTag,
      originalContent: scriptContent,
      modifiedContent: modifiedScriptContent,
      hasChanges,
      replacements,
    });

    // Append modified script in exact chronological location
    modifiedHtml += `${startTag}${modifiedScriptContent}${endTag}`;

    lastIndex = matchIndex + fullMatch.length;
    scriptCounter++;
  }

  // Append any trailing content after the last script tag
  modifiedHtml += html.slice(lastIndex);

  const modifiedScriptsCount = scripts.filter((s) => s.hasChanges).length;

  return {
    originalHtml: html,
    modifiedHtml,
    scripts,
    totalScripts: scripts.length,
    modifiedScriptsCount,
    localeReplacementsCount: totalLocaleReplacements,
    timezoneReplacementsCount: totalTimezoneReplacements,
    isChronologicalOrderPreserved: true,
  };
}
