import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, FileText, Code2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UploadZoneProps {
  htmlContent: string;
  fileName: string;
  onContentChange: (content: string, name: string) => void;
  scriptCount: number;
}

export function UploadZone({
  htmlContent,
  fileName,
  onContentChange,
  scriptCount,
}: UploadZoneProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      readFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onContentChange(content || '', file.name);
    };
    reader.readAsText(file);
  };

  const lineCount = htmlContent ? htmlContent.split('\n').length : 0;
  const byteCount = new Blob([htmlContent]).size;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="tab-upload-btn"
            onClick={() => setActiveTab('upload')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>File Upload</span>
          </button>
          <button
            type="button"
            id="tab-paste-btn"
            onClick={() => setActiveTab('paste')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'paste'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Paste / Edit HTML</span>
          </button>
        </div>

        {htmlContent && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
              <FileText className="w-3 h-3 text-slate-400" />
              {fileName || 'document.html'}
            </span>
            <span className="text-slate-300">•</span>
            <span>{lineCount.toLocaleString()} lines</span>
            <span className="text-slate-300">•</span>
            <span>{(byteCount / 1024).toFixed(1)} KB</span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-indigo-700 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" />
              {scriptCount} &lt;script&gt; {scriptCount === 1 ? 'block' : 'blocks'}
            </span>
          </div>
        )}
      </div>

      {/* Tab contents */}
      <div className="p-4">
        {activeTab === 'upload' ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".html,.htm,.txt"
              className="hidden"
              id="html-file-picker"
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse or drag &amp; drop your HTML file here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports <code className="font-mono text-slate-700">.html</code>, <code className="font-mono text-slate-700">.htm</code> audit reports, email templates, log exports
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-indigo-600 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-2xs">
                Select File from Computer
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="html-paste-input" className="block text-xs font-medium text-slate-600 mb-1">
              Raw HTML Content:
            </label>
            <textarea
              id="html-paste-input"
              rows={9}
              value={htmlContent}
              onChange={(e) => onContentChange(e.target.value, fileName || 'custom-input.html')}
              placeholder="<!DOCTYPE html>&#10;<html>&#10;<body>&#10;  <script>&#10;    const locale = &quot;en-US&quot;;&#10;    const opts = { timeZone: &quot;UTC&quot; };&#10;  </script>&#10;</body>&#10;</html>"
              className="w-full font-mono text-xs p-3 rounded-lg border border-slate-200 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}

        {/* Informational banner */}
        {!htmlContent && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span>No HTML loaded yet. Click </span>
              <button
                type="button"
                onClick={() => {
                  const btn = document.getElementById('load-sample-btn');
                  if (btn) btn.click();
                }}
                className="underline font-semibold hover:text-amber-950 cursor-pointer"
              >
                Load Sample HTML
              </button>
              <span> to test with a realistic chronological event report containing <code className="font-mono bg-amber-100 px-1 rounded text-amber-900">const locale = "en-US"</code> and <code className="font-mono bg-amber-100 px-1 rounded text-amber-900">timeZone: "UTC"</code>.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
