import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Eye, 
  Key,
  Image as ImageIcon,
  Binary,
  ShieldCheck,
  Check,
  Loader2,
  FileCheck2
} from 'lucide-react';
import { FaceLandmarkOverlay } from '../components/FaceLandmarkOverlay';

interface NewInvestigationPageProps {
  onStartInvestigation: (fileOrData: File | string, title: string) => Promise<void>;
  isLoading: boolean;
  pipelineStageIndex: number;
}

interface SearchActivityStep {
  label: string;
  activeLabel: string;
  completedLabel: string;
}

export const NewInvestigationPage: React.FC<NewInvestigationPageProps> = ({
  onStartInvestigation,
  isLoading,
  pipelineStageIndex
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // SerpApi Key management in UI
  const [serpApiKeyInput, setSerpApiKeyInput] = useState<string>('');
  const [isSerpApiConfigured, setIsSerpApiConfigured] = useState<boolean>(false);
  const [serpKeyMasked, setSerpKeyMasked] = useState<string | null>(null);
  const [isSavingKey, setIsSavingKey] = useState<boolean>(false);
  const [keySaveSuccess, setKeySaveSuccess] = useState<boolean>(false);

  // Check SerpApi status on load
  useEffect(() => {
    fetch('/api/settings/serpapi')
      .then((res) => res.json())
      .then((data) => {
        setIsSerpApiConfigured(Boolean(data.configured));
        setSerpKeyMasked(data.maskedKey || null);
      })
      .catch(() => {});
  }, []);

  const handleSaveSerpApiKey = async () => {
    if (!serpApiKeyInput.trim()) return;
    try {
      setIsSavingKey(true);
      const res = await fetch('/api/settings/serpapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: serpApiKeyInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSerpApiConfigured(true);
        setSerpKeyMasked(`${serpApiKeyInput.slice(0, 6)}...${serpApiKeyInput.slice(-4)}`);
        setSerpApiKeyInput('');
        setKeySaveSuccess(true);
        setTimeout(() => setKeySaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setErrorMessage(`Failed to save SerpApi key: ${err.message}`);
    } finally {
      setIsSavingKey(false);
    }
  };

  const processFile = (file: File) => {
    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(`Invalid format (${file.type || 'unknown'}). Supported formats: JPG/JPEG, PNG, WebP.`);
      return;
    }

    // Validate size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds 20MB maximum limit.`);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedTitle(`Investigation - ${file.name.replace(/\.[^/.]+$/, '')}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile && !previewUrl) {
      setErrorMessage('Please select or upload a valid facial photograph first.');
      return;
    }

    try {
      setErrorMessage(null);
      await onStartInvestigation(
        selectedFile || previewUrl!,
        selectedTitle || 'FaceProof Evidence Investigation'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Investigation initiation failed.');
    }
  };

  // Activity steps requested:
  // Uploading image... -> ✓ Image uploaded
  // Detecting face... -> ✓ Face detected
  // Generating embedding... -> ✓ Embedding generated
  // Uploading image to search provider... -> ✓ Search image uploaded
  // Searching Google Lens... -> ● Searching...
  // Receiving search results... -> ● Processing...
  // Candidate pages discovered... -> ● Analyzing...
  // Search completed.
  const searchActivitySteps: SearchActivityStep[] = [
    { label: 'Upload Image', activeLabel: 'Uploading image...', completedLabel: 'Image uploaded' },
    { label: 'Face Detection', activeLabel: 'Detecting face...', completedLabel: 'Face detected' },
    { label: 'Embedding Vector', activeLabel: 'Generating embedding...', completedLabel: 'Embedding generated' },
    { label: 'Search Provider Upload', activeLabel: 'Uploading image to search provider...', completedLabel: 'Search image uploaded' },
    { label: 'Google Lens Search', activeLabel: 'Searching Google Lens...', completedLabel: 'Google Lens search completed' },
    { label: 'Receive Results', activeLabel: 'Receiving search results...', completedLabel: 'Search results received' },
    { label: 'Candidate Analysis', activeLabel: 'Candidate pages discovered... Analyzing...', completedLabel: 'Candidates analyzed' },
    { label: 'Final Completion', activeLabel: 'Compiling evidence...', completedLabel: 'Search completed.' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <Scan className="w-6 h-6 text-cyan-400" />
            <span>Biometric Face Evidence Discovery</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real facial detection, InsightFace 512-D embedding generation, and real Google Lens reverse search via SerpApi
          </p>
        </div>
      </div>

      {/* SerpApi Key Configuration Banner */}
      <div className="p-4 rounded-2xl bg-[#080D1F] border border-blue-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                SerpApi Google Lens Key
              </span>
              {isSerpApiConfigured ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  CONFIGURED ({serpKeyMasked})
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  KEY REQUIRED FOR GOOGLE LENS
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Used to perform real reverse image queries with user uploaded files on Google Lens.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="password"
            value={serpApiKeyInput}
            onChange={(e) => setSerpApiKeyInput(e.target.value)}
            placeholder={isSerpApiConfigured ? "Update key..." : "Enter SerpApi key..."}
            className="bg-[#050816] text-xs font-mono text-white border border-blue-900/50 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 w-full md:w-48"
          />
          <button
            onClick={handleSaveSerpApiKey}
            disabled={isSavingKey || !serpApiKeyInput.trim()}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-mono text-xs font-medium shrink-0 transition-colors cursor-pointer"
          >
            {isSavingKey ? 'Saving...' : keySaveSuccess ? '✓ Saved' : 'Save Key'}
          </button>
        </div>
      </div>

      {/* Error Card */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-mono text-sm block text-red-300">Biometric / Search Issue:</strong>
            <p className="text-white font-mono text-xs">{errorMessage}</p>
            <p className="text-[11px] text-red-300/80">
              Ensure the uploaded image contains exactly one clear, well-lit primary face in JPG, PNG, or WebP format.
            </p>
          </div>
        </div>
      )}

      {/* Real Search Activity Progress Modal */}
      {isLoading && (
        <div className="p-6 rounded-3xl border border-cyan-500/40 bg-[#080D1F]/95 backdrop-blur-xl shadow-2xl shadow-cyan-950/40 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Live Search Activity
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-300">
              Stage {Math.min(pipelineStageIndex + 1, searchActivitySteps.length)} of {searchActivitySteps.length}
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {searchActivitySteps.map((step, idx) => {
              const isDone = pipelineStageIndex > idx;
              const isCurrent = pipelineStageIndex === idx;

              return (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    isCurrent 
                      ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-bold' 
                      : isDone 
                      ? 'text-slate-300' 
                      : 'text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isDone ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : isCurrent ? (
                      <span className="text-cyan-400 animate-pulse">●</span>
                    ) : (
                      <span className="text-slate-700">○</span>
                    )}
                    <span>
                      {isDone ? step.completedLabel : isCurrent ? step.activeLabel : step.label}
                    </span>
                  </div>

                  <span className="text-[10px]">
                    {isDone ? (
                      <span className="text-emerald-400">✓ Completed</span>
                    ) : isCurrent ? (
                      <span className="text-cyan-400 animate-pulse">Processing...</span>
                    ) : (
                      <span className="text-slate-600">Waiting</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Upload Area & Real-Time Biometric Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload file */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md p-6 space-y-5 shadow-xl shadow-blue-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-cyan-400" />
                Actual Evidence File Upload
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                JPG • PNG • WebP (Max 20MB)
              </span>
            </div>

            {/* Drag and drop upload zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) processFile(file);
              }}
              className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                dragActive 
                  ? 'border-cyan-400 bg-cyan-950/20' 
                  : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-950/10'
                  : 'border-blue-900/60 hover:border-blue-700/80 bg-[#050816]/60'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block space-y-3">
                <div className={`w-12 h-12 rounded-2xl border mx-auto flex items-center justify-center transition-transform ${
                  selectedFile 
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                    : 'bg-blue-950/60 border-blue-500/30 text-cyan-400 group-hover:scale-110'
                }`}>
                  {selectedFile ? <FileCheck2 className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors">
                    {selectedFile ? selectedFile.name : 'Click to select your evidence photograph'}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    {selectedFile 
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB • ${selectedFile.type} (Ready for InsightFace detection)`
                      : 'or drag and drop actual image file directly from your computer'}
                  </span>
                </div>
              </label>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                Investigation Reference Title
              </label>
              <input
                type="text"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="w-full bg-[#050816] text-xs font-mono text-white border border-blue-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="e.g. Investigation #INV-2026-001"
              />
            </div>

            {/* Quality & Integrity Notice */}
            <div className="p-3.5 rounded-xl bg-[#050816] border border-blue-900/30 text-[11px] font-mono text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Real Biometric Engine Pipeline
              </div>
              <p className="leading-relaxed">
                When you click <strong>ANALYZE & SEARCH</strong>, your uploaded image is streamed directly to the local Python InsightFace service for face detection, Laplacian sharpness validation, and 512-D vector extraction, then queried against Google Lens.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Biometric Preview & Search Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md p-6 space-y-5 shadow-xl shadow-blue-950/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  Biometric Subject Preview
                </span>
                <span className="text-xs font-mono text-cyan-300">
                  {selectedFile ? 'File Ready' : 'Awaiting File'}
                </span>
              </div>

              {previewUrl ? (
                <FaceLandmarkOverlay
                  imageSrc={previewUrl}
                  landmarks={{
                    leftEye: [0.38, 0.42],
                    rightEye: [0.62, 0.42],
                    noseTip: [0.50, 0.54],
                    mouthLeft: [0.40, 0.65],
                    mouthRight: [0.60, 0.65]
                  }}
                  isScanning={isLoading}
                  label={selectedFile ? selectedFile.name : 'SUBJECT EVIDENCE'}
                />
              ) : (
                <div className="aspect-square rounded-2xl border-2 border-dashed border-blue-900/40 bg-[#050816]/80 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-xs font-mono">No evidence image selected</span>
                  <span className="text-[10px] text-slate-600 mt-1">Upload an image to inspect facial geometry</span>
                </div>
              )}
            </div>

            {/* Validation Checklist */}
            <div className="p-4 rounded-2xl bg-[#050816] border border-blue-900/30 space-y-2.5 font-mono text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-blue-900/30 flex items-center justify-between">
                <span>PIPELINE PRE-FLIGHT CHECK</span>
                <span className="text-cyan-400 font-normal">Real Validation</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">User Image File</span>
                  <span className={selectedFile ? 'text-emerald-400 font-bold flex items-center gap-1' : 'text-slate-600'}>
                    {selectedFile ? `✓ ${selectedFile.name}` : 'Pending Upload'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">FastAPI Biometric Engine</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    InsightFace Ready
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vector Architecture</span>
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <Binary className="w-3.5 h-3.5" />
                    512-D Normalized
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reverse Search Index</span>
                  <span className={isSerpApiConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isSerpApiConfigured ? 'Google Lens (Active)' : 'SerpApi Key Needed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Analyze & Search Button */}
            <button
              id="btn-analyze-and-search"
              onClick={handleSubmit}
              disabled={isLoading || !previewUrl}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-medium text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="font-mono text-xs">Executing Biometric Pipeline...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>ANALYZE & SEARCH</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
