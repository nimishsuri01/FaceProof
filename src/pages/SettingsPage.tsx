import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  Cpu, 
  Layers,
  Globe,
  Key,
  ShieldCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.75);
  const [blurThreshold, setBlurThreshold] = useState<number>(50);
  const [networkName, setNetworkName] = useState<string>('Ethereum Sepolia / EVM Ledger');
  const [contractAddress, setContractAddress] = useState<string>('0x5FbDB2315678afecb367f032d93F642f64180aa3');
  const [serpApiKey, setSerpApiKey] = useState<string>('');
  const [isSerpApiConfigured, setIsSerpApiConfigured] = useState<boolean>(false);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [faceEngineStatus, setFaceEngineStatus] = useState<string>('checking...');

  useEffect(() => {
    // Check SerpApi Key
    fetch('/api/settings/serpapi')
      .then(res => res.json())
      .then(data => {
        setIsSerpApiConfigured(Boolean(data.configured));
        setMaskedKey(data.maskedKey || null);
      })
      .catch(() => {});

    // Check health of engine
    fetch('/api/health')
      .then(res => res.json())
      .then(res => {
        if (res.data?.faceService) setFaceEngineStatus(res.data.faceService);
      })
      .catch(() => setFaceEngineStatus('offline'));
  }, []);

  const handleSave = async () => {
    if (serpApiKey.trim()) {
      await fetch('/api/settings/serpapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: serpApiKey.trim() })
      });
      setIsSerpApiConfigured(true);
      setMaskedKey(`${serpApiKey.slice(0, 6)}...${serpApiKey.slice(-4)}`);
      setSerpApiKey('');
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    setSimilarityThreshold(0.75);
    setBlurThreshold(50);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <span>Forensic System Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure SerpApi Google Lens reverse image discovery, InsightFace biometric thresholds, and EVM ledger settings
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Configuration Applied</span>
          </div>
        )}
      </div>

      {/* SerpApi Search Provider Configuration */}
      <div className="p-6 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/30">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Google Lens Search Pipeline (SerpApi)
            </h3>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isSerpApiConfigured 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
              : 'bg-amber-950 text-amber-300 border-amber-800'
          }`}>
            {isSerpApiConfigured ? `ACTIVE (${maskedKey})` : 'API KEY REQUIRED'}
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            FaceProof uses the SerpApi 2-step image workflow: uploading the user's raw image buffer to <code className="text-cyan-300 font-mono text-[11px]">https://serpapi.com/image</code> to generate an <code className="text-cyan-300 font-mono text-[11px]">image_id</code>, then issuing a reverse visual search via <code className="text-cyan-300 font-mono text-[11px]">engine=google_lens</code>.
          </p>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              SerpApi API Key
            </label>
            <div className="flex items-center gap-3">
              <input
                type="password"
                value={serpApiKey}
                onChange={(e) => setSerpApiKey(e.target.value)}
                placeholder={isSerpApiConfigured ? "Key configured. Enter new value to update..." : "Enter your SerpApi API Key..."}
                className="flex-1 bg-[#050816] text-xs font-mono text-white border border-blue-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Engine Status */}
      <div className="p-6 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/30">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              InsightFace Biometric Service
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
            PORT 8001 (FASTAPI)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#050816] border border-blue-900/30">
            <span className="text-slate-400 text-[10px] block">SERVICE STATUS</span>
            <strong className="text-emerald-400 text-xs">{faceEngineStatus}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#050816] border border-blue-900/30">
            <span className="text-slate-400 text-[10px] block">MODEL WEIGHTS</span>
            <strong className="text-cyan-300 text-xs">buffalo_sc (det_500m, w600k)</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#050816] border border-blue-900/30">
            <span className="text-slate-400 text-[10px] block">FEATURE VECTOR</span>
            <strong className="text-white text-xs">512-D L2-Normalized</strong>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Match Acceptance Threshold:</span>
              <span className="text-cyan-400 font-bold">{(similarityThreshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.01"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Minimum Laplacian Blur Sharpness:</span>
              <span className="text-cyan-400 font-bold">{blurThreshold}</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={blurThreshold}
              onChange={(e) => setBlurThreshold(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Blockchain Ledger Settings */}
      <div className="p-6 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/30">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Blockchain Registry Parameters
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            SMART CONTRACT VERIFIED
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-wide block mb-1">
              EvidenceRegistry Contract Address
            </label>
            <input
              type="text"
              readOnly
              value={contractAddress}
              className="w-full bg-[#050816] text-cyan-300 border border-blue-900/40 rounded-xl px-4 py-2.5 font-mono text-xs focus:outline-none select-all"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-wide block mb-1">
              Target Ledger Network
            </label>
            <input
              type="text"
              readOnly
              value={networkName}
              className="w-full bg-[#050816] text-slate-300 border border-blue-900/40 rounded-xl px-4 py-2.5 font-mono text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};
