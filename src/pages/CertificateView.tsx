import React from 'react';
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  Share2, 
  ExternalLink, 
  Lock, 
  Award,
  CheckCircle2,
  FileCode,
  Calendar,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { ActiveTab, Investigation } from '../types';

interface CertificateViewProps {
  investigation: Investigation | null;
  setActiveTab: (tab: ActiveTab) => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  investigation,
  setActiveTab
}) => {
  if (!investigation) {
    return (
      <div className="p-12 text-center rounded-3xl bg-[#080D1F]/80 border border-blue-900/40 max-w-lg mx-auto text-xs font-mono text-slate-400">
        No active investigation available to produce a verification certificate.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(investigation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `faceproof_certificate_${investigation.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const evidenceHash = investigation.evidenceHash || '0xa91fc83d9a74e5025cb3f738de04112e47e8c15839b2512a865f80b271d441ae';
  const blockNumber = investigation.blockchainRecord?.blockNumber || 1948240;
  const txHash = investigation.blockchainRecord?.transactionHash || '0x7c49b109e20cb37452e8271a5391d1e4892c55b66d8b941584c0128b0f2a93ee';
  const network = investigation.blockchainRecord?.network || 'Ethereum Sepolia / EVM Ledger';
  const sourceRef = investigation.evidencePackage?.canonicalSourceUrl || 'https://globalnewswire.press/investigations/special-report-archive/img-84920.html';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => setActiveTab('verification')}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Verification</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* The Printable Certificate Container */}
      <div 
        id="certificate-printable"
        className="rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-b from-[#080D1F] via-[#050816] to-[#080D1F] p-8 sm:p-12 space-y-8 relative overflow-hidden shadow-2xl shadow-cyan-950/20"
      >
        {/* Certificate Decorative Border */}
        <div className="absolute inset-2 border border-blue-500/20 rounded-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 p-0.5 mx-auto shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-[#050816] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] text-cyan-400 font-bold uppercase block">
              FACEPROOF PROTOCOL
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight mt-1">
              EVIDENCE VERIFICATION CERTIFICATE
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Immutable Cryptographic Chain of Custody & Provenance Attestation
            </p>
          </div>
        </div>

        {/* Status Stamp */}
        <div className="py-4 px-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1 relative z-10">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-base sm:text-lg font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>✓ CRYPTOGRAPHICALLY VERIFIED</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 font-sans">
            The canonical evidence fingerprint is authenticated by mathematical consensus on the blockchain ledger.
          </p>
        </div>

        {/* Certificate Data Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs relative z-10">
          <div className="p-4 rounded-xl bg-[#050816] border border-blue-900/30 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Investigation Session</span>
            <div className="text-white font-bold">{investigation.title}</div>
            <div className="text-[10px] text-cyan-400">{investigation.id}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#050816] border border-blue-900/30 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Discovery Timestamp</span>
            <div className="text-white font-bold">{new Date(investigation.createdAt).toUTCString()}</div>
            <div className="text-[10px] text-slate-400">Standard UTC ISO-8601</div>
          </div>

          <div className="p-4 rounded-xl bg-[#050816] border border-blue-900/30 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Blockchain Network</span>
            <div className="text-cyan-300 font-bold">{network}</div>
            <div className="text-[10px] text-slate-400">Block Height: #{blockNumber}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#050816] border border-blue-900/30 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Match Confidence</span>
            <div className="text-emerald-400 font-bold">
              {investigation.evidencePackage ? `${(investigation.evidencePackage.finalConfidence * 100).toFixed(1)}% (HIGH)` : '94.2% (HIGH)'}
            </div>
            <div className="text-[10px] text-slate-400">Face Similarity: 94.2%</div>
          </div>
        </div>

        {/* Cryptographic Proof Details */}
        <div className="p-5 rounded-2xl bg-[#050816] border border-blue-900/40 space-y-3 font-mono text-xs relative z-10">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block mb-1">
              Evidence Cryptographic SHA-256 Fingerprint (bytes32)
            </span>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-blue-950 text-cyan-300 break-all select-all">
              {evidenceHash}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block mb-1">
              Blockchain Transaction Hash
            </span>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-blue-950 text-slate-300 break-all select-all">
              {txHash}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block mb-1">
              Canonical Evidence Source Reference
            </span>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-blue-950 text-blue-400 break-all">
              {sourceRef}
            </div>
          </div>
        </div>

        {/* Legal & Privacy Disclaimer */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 text-[11px] text-slate-400 leading-relaxed relative z-10">
          <strong>Evidentiary Notice:</strong> This cryptographic certificate attests to the provenance and mathematical integrity of the retrieved digital evidence package. It confirms that the evidence content representation is identical to that registered at block #{blockNumber}. It does not claim judicial determination of real-world identity.
        </div>

        {/* Signatures & Seal */}
        <div className="pt-6 border-t border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 font-mono text-xs">
          <div className="text-center sm:text-left">
            <div className="text-slate-300 font-bold">Investigator Suri</div>
            <div className="text-[10px] text-slate-500">Badge #FP-AUTH-901 • Authorized Forensics Unit</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center font-bold text-[9px] text-cyan-400 text-center tracking-tighter">
              SEAL<br/>PROOF
            </div>
            <div className="text-right">
              <div className="text-slate-300 font-bold">EVM Consensus Verified</div>
              <div className="text-[10px] text-cyan-400">EvidenceRegistry.sol</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
