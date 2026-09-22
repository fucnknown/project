import { Download, Copy, Check, FileCheck, ArrowDownToLine } from 'lucide-react';

interface ExportBarProps {
  fileName: string;
  onDownload: () => void;
  onCopy: () => void;
  hasCopied: boolean;
  disabled: boolean;
  replacementsCount: number;
}

export function ExportBar({
  fileName,
  onDownload,
  onCopy,
  hasCopied,
  disabled,
  replacementsCount,
}: ExportBarProps) {
  const exportFileName = fileName.endsWith('.html') || fileName.endsWith('.htm')
    ? `modified-${fileName}`
    : `${fileName || 'modified-document'}.html`;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                Export Processed HTML
              </h3>
              <span className="text-2xs font-mono px-2 py-0.5 rounded bg-white/10 text-indigo-200 border border-white/10">
                {exportFileName}
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              {replacementsCount > 0 ? (
                <span>
                  {replacementsCount} replacements applied with strict chronological fidelity.
                </span>
              ) : (
                <span>Original structure intact. Ready to export.</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCopy}
            disabled={disabled}
            id="copy-to-clipboard-main-btn"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={disabled}
            id="download-html-btn"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-900/40 hover:shadow-indigo-900/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Download Modified HTML</span>
          </button>
        </div>
      </div>
    </div>
  );
}
