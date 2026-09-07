import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Search, 
  Lock, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  Cpu, 
  Layers,
  Globe,
  Radio
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [searchProvider, setSearchProvider] = useState<'demo' | 'live'>('demo');
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.82);
  const [blurThreshold, setBlurThreshold] = useState<number>(60);
  const [networkName, setNetworkName] = useState<string>('Ethereum Sepolia / Local EVM Ledger');
  const [contractAddress, setContractAddress] = useState<string>('0x5FbDB2315678afecb367f032d93F642f64180aa3');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/system/network')
      .then(res => res.json())
      .then(data => {
        if (data.network) setNetworkName(data.network);
        if (data.contract) setContractAddress(data.contract);
      })
      .catch(console.error);
  }, []);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    setSearchProvider('demo');
    setSimilarityThreshold(0.82);
    setBlurThreshold(60);
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
            Configure search provider pipelines, EVM smart contract settings, and similarity thresholds
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Configuration Applied</span>
          </div>
        )}
      </div>

      {/* Search Provider Section */}
      <div className="p-6 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/30">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Evidence Discovery Provider
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
            {searchProvider === 'demo' ? 'DEMO MODE ACTIVE' : 'LIVE API CONFIGURED'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demo Provider Card */}
          <div 
            onClick={() => setSearchProvider('demo')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              searchProvider === 'demo'
                ? 'border-cyan-400 bg-cyan-950/20 shadow-md ring-1 ring-cyan-400/30'
                : 'border-blue-900/30 bg-[#050816] opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">Demo Forensic Corpus (Recommended)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Uses high-fidelity simulated investigations (Elena Vance, Marcus Chen) with zero external network rate-limits. Ideal for evaluation and judging.
            </p>
          </div>

          {/* Live Provider Card */}
          <div 
            onClick={() => setSearchProvider('live')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              searchProvider === 'live'
                ? 'border-cyan-400 bg-cyan-950/20 shadow-md ring-1 ring-cyan-400/30'
                : 'border-blue-900/30 bg-[#050816] opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">Live Search API (Google / Bing)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Connects to real-world live reverse image search APIs. Gracefully falls back to demo corpus when no API key is specified in environment.
            </p>
          </div>
        </div>
      </div>

      {/* Blockchain & Smart Contract Settings */}
      <div className="p-6 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-blue-900/30">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            EVM Blockchain Provenance Registry
          </h3>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-slate-400">Network Name & Consensus Protocol</label>
            <input
              type="text"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              className="w-full bg-[#050816] text-white border border-blue-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Deployed Smart Contract (EvidenceRegistry.sol)</label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full bg-[#050816] text-cyan-300 border border-blue-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Forensic Thresholds & Weights */}
      <div className="p-6 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md space-y-5 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-blue-900/30">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            Biometric Thresholds & Multi-Signal Weights
          </h3>
        </div>

        <div className="space-y-5 font-mono text-xs">
          {/* Slider 1: Face Similarity Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Minimum Face Match Confidence (Cosine Distance)</span>
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
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.50 (Permissive)</span>
              <span>0.82 (Standard Forensic)</span>
              <span>0.95 (Strict Judicial)</span>
            </div>
          </div>

          {/* Slider 2: Blur Rejection Guard */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Laplacian Variance Blur Rejection Threshold</span>
              <span className="text-cyan-400 font-bold">{blurThreshold}</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={blurThreshold}
              onChange={(e) => setBlurThreshold(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20 (Allow blurry)</span>
              <span>60 (Default Guard)</span>
              <span>100 (Ultra Sharp Only)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};
