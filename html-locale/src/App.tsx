import { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ConfigPanel } from './components/ConfigPanel';
import { DiffViewer } from './components/DiffViewer';
import { ChronologicalAudit } from './components/ChronologicalAudit';
import { ExportBar } from './components/ExportBar';
import { ModifierConfig } from './types';
import { processHtmlContent } from './utils/htmlModifier';
import { SAMPLE_HTML } from './data/sampleHtml';
import { Info, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [htmlContent, setHtmlContent] = useState<string>(SAMPLE_HTML);
  const [fileName, setFileName] = useState<string>('session-audit-report.html');
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const [config, setConfig] = useState<ModifierConfig>({
    targetLocale: 'es-US',
    targetTimeZone: 'America/Argentina/Buenos_Aires',
    matchAnyLocale: false,
    matchAnyTimeZone: false,
  });

  // Deterministically compute modifications whenever HTML or Config changes
  const modificationResult = useMemo(() => {
    return processHtmlContent(htmlContent, config);
  }, [htmlContent, config]);

  const handleLoadSample = useCallback(() => {
    setHtmlContent(SAMPLE_HTML);
    setFileName('session-audit-report.html');
  }, []);

  const handleReset = useCallback(() => {
    setHtmlContent('');
    setFileName('');
  }, []);

  const handleDownload = useCallback(() => {
    if (!modificationResult.modifiedHtml) return;

    const blob = new Blob([modificationResult.modifiedHtml], {
      type: 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'document';
    a.download = `modified-${baseName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [modificationResult.modifiedHtml, fileName]);

  const handleCopy = useCallback(() => {
    if (!modificationResult.modifiedHtml) return;

    navigator.clipboard.writeText(modificationResult.modifiedHtml).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    });
  }, [modificationResult.modifiedHtml]);

  const totalReplacements =
    modificationResult.localeReplacementsCount +
    modificationResult.timezoneReplacementsCount;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col antialiased">
      <Header
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        hasContent={Boolean(htmlContent)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Specification callout pill */}
        <section
          id="spec-summary-banner"
          aria-label="Parser Rules"
          className="bg-white rounded-xl border border-indigo-100 p-4 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm">
                Strict Chronological Script Transformer
              </div>
              <p className="text-slate-500 mt-0.5">
                Modifies lines in any <code className="font-mono text-slate-700 bg-slate-100 px-1 rounded">&lt;script&gt;</code> block matching:{' '}
                <span className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded font-semibold">const locale = "en-US"</span>{' '}
                and{' '}
                <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded font-semibold">timeZone: "UTC"</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-2xs">
            <div className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80">
              Locale &rarr; <span className="text-indigo-700 font-bold">"{config.targetLocale}"</span>
            </div>
            <div className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80">
              TZ &rarr; <span className="text-sky-700 font-bold">"{config.targetTimeZone}"</span>
            </div>
          </div>
        </section>

        {/* Input & Parameters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Upload Zone */}
          <div className="lg:col-span-6">
            <UploadZone
              htmlContent={htmlContent}
              fileName={fileName}
              onContentChange={(content, name) => {
                setHtmlContent(content);
                setFileName(name);
              }}
              scriptCount={modificationResult.totalScripts}
            />
          </div>

          {/* Configuration Parameters Panel */}
          <div className="lg:col-span-6">
            <ConfigPanel config={config} onChange={setConfig} />
          </div>
        </div>

        {/* Export Bar */}
        {htmlContent && (
          <ExportBar
            fileName={fileName}
            onDownload={handleDownload}
            onCopy={handleCopy}
            hasCopied={hasCopied}
            disabled={!htmlContent}
            replacementsCount={totalReplacements}
          />
        )}

        {/* Chronological Audit & Date Formatting Verification Panel */}
        {htmlContent && (
          <ChronologicalAudit
            htmlContent={htmlContent}
            targetLocale={config.targetLocale}
            targetTimeZone={config.targetTimeZone}
          />
        )}

        {/* Diff & Inspection Viewer */}
        {htmlContent && (
          <DiffViewer
            result={modificationResult}
            onCopyHtml={handleCopy}
            hasCopied={hasCopied}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <span>Client-side sequential stream processor • Preserves all HTML comments, doctype, and chronological ordering</span>
        </div>
      </footer>
    </div>
  );
}
