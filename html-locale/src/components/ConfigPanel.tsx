import { useMemo } from 'react';
import { Globe, Clock, Check, AlertTriangle, Settings2, RotateCcw } from 'lucide-react';
import { ModifierConfig } from '../types';
import { isValidLocale, isValidTimeZone, getLocaleDisplayName } from '../utils/dateValidator';

interface ConfigPanelProps {
  config: ModifierConfig;
  onChange: (newConfig: ModifierConfig) => void;
}

const COMMON_LOCALES = [
  { code: 'es-US', label: 'Spanish (US)' },
  { code: 'es-AR', label: 'Spanish (Argentina)' },
  { code: 'es-ES', label: 'Spanish (Spain)' },
  { code: 'es-MX', label: 'Spanish (Mexico)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
];

const COMMON_TIMEZONES = [
  { tz: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (ART -03)' },
  { tz: 'America/New_York', label: 'New York (EDT/EST)' },
  { tz: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { tz: 'America/Mexico_City', label: 'Mexico City (CST)' },
  { tz: 'America/Los_Angeles', label: 'Los Angeles (PDT/PST)' },
  { tz: 'Europe/Madrid', label: 'Madrid (CEST/CET)' },
  { tz: 'UTC', label: 'UTC Universal' },
];

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const isLocaleValid = useMemo(() => isValidLocale(config.targetLocale), [config.targetLocale]);
  const isTzValid = useMemo(() => isValidTimeZone(config.targetTimeZone), [config.targetTimeZone]);
  const localeDisplayName = useMemo(() => getLocaleDisplayName(config.targetLocale), [config.targetLocale]);

  // Live time preview in target timezone
  const liveTzPreview = useMemo(() => {
    if (!isTzValid) return null;
    try {
      return new Intl.DateTimeFormat(config.targetLocale || 'es-US', {
        timeZone: config.targetTimeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      }).format(new Date());
    } catch {
      return null;
    }
  }, [config.targetLocale, config.targetTimeZone, isTzValid]);

  const handleResetDefaults = () => {
    onChange({
      targetLocale: 'es-US',
      targetTimeZone: 'America/Argentina/Buenos_Aires',
      matchAnyLocale: false,
      matchAnyTimeZone: false,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Settings2 className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800">
            Replacement Parameters
          </h2>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          id="reset-config-defaults-btn"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults (es-US &amp; Buenos Aires)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Target Locale Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="target-locale-input" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Target Locale Code</span>
            </label>
            <span className="text-xs text-slate-400 font-mono">
              default: "es-US"
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              id="target-locale-input"
              value={config.targetLocale}
              onChange={(e) => onChange({ ...config, targetLocale: e.target.value.trim() })}
              placeholder="e.g. es-US"
              className={`w-full px-3 py-2 text-sm font-mono rounded-lg border focus:outline-hidden transition-colors ${
                isLocaleValid
                  ? 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  : 'border-amber-300 bg-amber-50/40 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
              }`}
            />
            <div className="absolute right-2.5 top-2.5">
              {isLocaleValid ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Resolved: <strong className="text-slate-700">{localeDisplayName}</strong>
            </span>
            {!isLocaleValid && (
              <span className="text-amber-600 font-medium">Unknown BCP-47 locale</span>
            )}
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {COMMON_LOCALES.map((item) => (
              <button
                key={item.code}
                type="button"
                id={`preset-locale-${item.code}`}
                onClick={() => onChange({ ...config, targetLocale: item.code })}
                className={`px-2 py-0.5 text-xs rounded-md font-mono transition-all ${
                  config.targetLocale === item.code
                    ? 'bg-indigo-600 text-white font-medium shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={item.label}
              >
                {item.code}
              </button>
            ))}
          </div>
        </div>

        {/* Target Timezone Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="target-timezone-input" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Target TimeZone (TZ Identifier)</span>
            </label>
            <span className="text-xs text-slate-400 font-mono">
              default: "America/Argentina/Buenos_Aires"
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              id="target-timezone-input"
              value={config.targetTimeZone}
              onChange={(e) => onChange({ ...config, targetTimeZone: e.target.value.trim() })}
              placeholder="e.g. America/Argentina/Buenos_Aires"
              className={`w-full px-3 py-2 text-sm font-mono rounded-lg border focus:outline-hidden transition-colors ${
                isTzValid
                  ? 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                  : 'border-amber-300 bg-amber-50/40 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
              }`}
            />
            <div className="absolute right-2.5 top-2.5">
              {isTzValid ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Current Time: <strong className="text-slate-700">{liveTzPreview || 'N/A'}</strong>
            </span>
            {!isTzValid && (
              <span className="text-amber-600 font-medium">Invalid IANA TimeZone</span>
            )}
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {COMMON_TIMEZONES.map((item) => (
              <button
                key={item.tz}
                type="button"
                id={`preset-tz-${item.tz.replace(/\//g, '-')}`}
                onClick={() => onChange({ ...config, targetTimeZone: item.tz })}
                className={`px-2 py-0.5 text-xs rounded-md font-mono transition-all ${
                  config.targetTimeZone === item.tz
                    ? 'bg-sky-600 text-white font-medium shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={item.label}
              >
                {item.tz.split('/').pop()?.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Matching Flexibility Options */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              id="match-any-locale-checkbox"
              checked={config.matchAnyLocale}
              onChange={(e) => onChange({ ...config, matchAnyLocale: e.target.checked })}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>Match any <code className="font-mono text-slate-700">const locale = "..."</code> (not just "en-US")</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              id="match-any-tz-checkbox"
              checked={config.matchAnyTimeZone}
              onChange={(e) => onChange({ ...config, matchAnyTimeZone: e.target.checked })}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span>Match any <code className="font-mono text-slate-700">timeZone: "..."</code> (not just "UTC")</span>
          </label>
        </div>

        <span className="text-slate-400 italic">
          Preserves whitespace, tags, and script chronological order
        </span>
      </div>
    </div>
  );
}
