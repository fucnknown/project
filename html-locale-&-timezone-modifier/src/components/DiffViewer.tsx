import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  FileCode,
  Copy,
  Eye,
  Check,
  SplitSquareVertical,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ModificationResult, ParsedScript } from '../types';

interface DiffViewerProps {
  result: ModificationResult;
  onCopyHtml: () => void;
  hasCopied: boolean;
}

export function DiffViewer({ result, onCopyHtml, hasCopied }: DiffViewerProps) {
  const [activeTab, setActiveTab] = useState<'scripts' | 'full' | 'preview'>('scripts');
  const [selectedScriptId, setSelectedScriptId] = useState<number | 'all'>('all');

  const filteredScripts = useMemo(() => {
    if (selectedScriptId === 'all') {
      return result.scripts;
    }
    return result.scripts.filter((s) => s.id === selectedScriptId);
  }, [result.scripts, selectedScriptId]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Top summary metrics bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
            <span className="text-xs text-slate-500 block">Total &lt;script&gt; Blocks</span>
            <span className="text-lg font-bold text-slate-800">{result.totalScripts}</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
            <span className="text-xs text-slate-500 block">Scripts Modified</span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-indigo-600">{result.modifiedScriptsCount}</span>
              <span className="text-xs text-slate-400">/ {result.totalScripts}</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
            <span className="text-xs text-slate-500 block">Locale Replacements</span>
            <span className="text-lg font-bold text-emerald-600">
              {result.localeReplacementsCount}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
            <span className="text-xs text-slate-500 block">Timezone Replacements</span>
            <span className="text-lg font-bold text-sky-600">
              {result.timezoneReplacementsCount}
            </span>
          </div>
        </div>

        {/* Chronological order guarantee banner */}
        <div className="mt-3 flex items-center justify-between text-xs px-3 py-1.5 rounded-md bg-emerald-50/80 border border-emerald-200/70 text-emerald-800">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Original Chronological Order: 100% Preserved</span>
          </div>
          <span className="text-emerald-700 text-2xs hidden sm:inline">
            Processed linearly via sequential stream parser
          </span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="px-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('scripts')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'scripts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Script Diffs ({result.modifiedScriptsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('full')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'full'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Full Modified HTML</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Render Preview</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopyHtml}
            id="copy-html-btn"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-4">
        {activeTab === 'scripts' && (
          <div className="space-y-4">
            {result.scripts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No &lt;script&gt; tags detected in this HTML document.
              </div>
            ) : (
              <>
                {result.scripts.length > 1 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Filter by script:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedScriptId('all')}
                      className={`px-2 py-0.5 rounded text-2xs font-medium transition-colors ${
                        selectedScriptId === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({result.scripts.length})
                    </button>
                    {result.scripts.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedScriptId(s.id)}
                        className={`px-2 py-0.5 rounded text-2xs font-medium transition-colors flex items-center gap-1 ${
                          selectedScriptId === s.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>Script #{s.index}</span>
                        {s.hasChanges && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  {filteredScripts.map((script) => (
                    <ScriptCard key={script.id} script={script} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'full' && (
          <div>
            <div className="flex items-center justify-between pb-2 text-xs text-slate-500">
              <span>Entire HTML output ready for download or integration:</span>
              <span>{result.modifiedHtml.length.toLocaleString()} characters</span>
            </div>
            <pre className="bg-slate-950 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed select-all">
              <code>{result.modifiedHtml}</code>
            </pre>
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
              <span>Isolated iframe preview of the modified HTML document:</span>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-inner">
              <iframe
                title="HTML Preview"
                srcDoc={result.modifiedHtml}
                sandbox="allow-scripts"
                className="w-full h-96 border-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScriptCard({ script }: { script: ParsedScript }) {
  return (
    <div
      className={`rounded-lg border overflow-hidden transition-all ${
        script.hasChanges
          ? 'border-indigo-200/90 bg-indigo-50/20'
          : 'border-slate-200 bg-slate-50/40'
      }`}
    >
      <div className="px-3.5 py-2.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-slate-100 text-slate-700">
            Script #{script.index}
          </span>
          <code className="text-xs font-mono text-slate-600">
            {script.startTag}
          </code>
        </div>

        {script.hasChanges ? (
          <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3" />
            {script.replacements.length} {script.replacements.length === 1 ? 'replacement' : 'replacements'} applied
          </span>
        ) : (
          <span className="text-2xs text-slate-400 italic">
            No matching locale or timezone lines in this script
          </span>
        )}
      </div>

      {script.hasChanges ? (
        <div className="p-3.5 space-y-2.5">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
            Chronological Line Replacements:
          </div>
          <div className="space-y-2">
            {script.replacements.map((rep, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-md bg-white border border-slate-200 text-xs font-mono space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-2xs text-slate-400">
                  <span className="font-semibold text-slate-600">
                    Line {rep.lineNumber} ({rep.type === 'locale' ? 'Locale Definition' : 'Timezone Definition'})
                  </span>
                </div>

                <div className="flex items-start gap-2 bg-rose-50 text-rose-800 p-1.5 rounded border border-rose-100">
                  <span className="text-rose-500 font-bold shrink-0">-</span>
                  <span className="line-through opacity-80 break-all">{rep.originalText}</span>
                </div>

                <div className="flex items-center gap-2 pl-3 py-0.5 text-slate-400">
                  <ArrowRight className="w-3 h-3 text-indigo-500" />
                  <span className="text-2xs text-indigo-600 font-sans font-medium">Replaced with</span>
                </div>

                <div className="flex items-start gap-2 bg-emerald-50 text-emerald-900 p-1.5 rounded border border-emerald-200">
                  <span className="text-emerald-600 font-bold shrink-0">+</span>
                  <span className="font-bold break-all">{rep.replacedText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3">
          <p className="text-xs text-slate-500">
            Script preserved byte-for-byte in original chronological position.
          </p>
        </div>
      )}
    </div>
  );
}
