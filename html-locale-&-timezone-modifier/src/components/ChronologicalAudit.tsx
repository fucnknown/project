import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { extractChronologicalDates, evaluateDateFormatting } from '../utils/dateValidator';

interface ChronologicalAuditProps {
  htmlContent: string;
  targetLocale: string;
  targetTimeZone: string;
}

export function ChronologicalAudit({
  htmlContent,
  targetLocale,
  targetTimeZone,
}: ChronologicalAuditProps) {
  const [customDate, setCustomDate] = useState('');

  // Extract date strings found in HTML
  const detectedDates = useMemo(() => {
    return extractChronologicalDates(htmlContent);
  }, [htmlContent]);

  // Combine detected with any custom test date
  const testDates = useMemo(() => {
    const list = [...detectedDates];
    if (customDate.trim() && !list.includes(customDate.trim())) {
      list.push(customDate.trim());
    }
    return list;
  }, [detectedDates, customDate]);

  const { tests, isChronological } = useMemo(() => {
    return evaluateDateFormatting(
      testDates,
      targetLocale || 'es-US',
      targetTimeZone || 'America/Argentina/Buenos_Aires'
    );
  }, [testDates, targetLocale, targetTimeZone]);

  const handleAddCustomDate = () => {
    if (!customDate) {
      setCustomDate(new Date().toISOString());
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Date Format &amp; Chronological Order Verification
            </h3>
            <p className="text-xs text-slate-500">
              Validates parsed date strings, time zone transitions, and sequential ordering
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isChronological ? (
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Chronological Integrity: Validated
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" />
              Non-monotonic timestamp detected
            </span>
          )}
        </div>
      </div>

      {/* Verification table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/60 font-medium">
              <th className="py-2.5 px-3 rounded-l-lg">Seq #</th>
              <th className="py-2.5 px-3">Parsed ISO / Date String</th>
              <th className="py-2.5 px-3">
                Original (<span className="font-mono text-slate-700">en-US</span>, <span className="font-mono text-slate-700">UTC</span>)
              </th>
              <th className="py-2.5 px-3 rounded-r-lg">
                Modified (<span className="font-mono text-indigo-700">{targetLocale}</span>, <span className="font-mono text-indigo-700">{targetTimeZone.split('/').pop()}</span>)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tests.map((test, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 px-3 text-slate-400 font-mono">
                  #{idx + 1}
                </td>
                <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{test.isoString}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-mono">
                  {test.formattedOriginal}
                </td>
                <td className="py-2.5 px-3 font-mono font-semibold text-indigo-900 bg-indigo-50/30">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span>{test.formattedModified}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Custom Date Tester */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            placeholder="Test custom ISO date: 2026-09-22T15:30:00Z"
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono w-64 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleAddCustomDate}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-3 h-3" />
            <span>Now ISO</span>
          </button>
        </div>

        <div className="text-2xs text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Accurate Intl.DateTimeFormat output with daylight saving &amp; offset calculations</span>
        </div>
      </div>
    </div>
  );
}
