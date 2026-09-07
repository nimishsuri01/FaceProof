import React from 'react';
import { X, ShieldAlert, Lock, CheckCircle2, EyeOff, FileText } from 'lucide-react';

interface ResponsibleUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResponsibleUseModal: React.FC<ResponsibleUseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        id="modal-responsible-use"
        className="w-full max-w-2xl bg-[#080D1F] border border-blue-800/70 rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/80 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="p-5 border-b border-blue-900/40 bg-[#050816]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                Responsible Use & Privacy Policy
              </h3>
              <p className="text-xs text-cyan-400/90 font-mono">
                Ethical Biometrics & Blockchain Evidence Governance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto">
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 text-cyan-200">
            <strong>Core Mission:</strong> FaceProof is designed for authorized evidence provenance, legal discovery, journalism fact-checking, and cryptographic integrity verification. It is strictly forbidden for unauthorized surveillance or tracking.
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#050816] border border-blue-900/30">
              <EyeOff className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs mb-0.5">
                  Zero Biometrics On-Chain
                </strong>
                Neither raw face photographs nor 512-dimensional facial embedding vectors are ever written to the public blockchain. Only the cryptographic SHA-256 fingerprint of the canonical evidence package is anchored.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#050816] border border-blue-900/30">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs mb-0.5">
                  Transient Volatile Processing
                </strong>
                Uploaded images are analyzed in-memory for facial feature geometry and similarity scoring. They are never sold, rented, or added to training sets.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#050816] border border-blue-900/30">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs mb-0.5">
                  Authorized Consent & Lawful Investigation
                </strong>
                Use FaceProof only with images and evidence you are legally authorized to process. This tool establishes evidence integrity and discovery provenance—it does not claim to replace judicial determination of identity.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-blue-900/20">
            Complies with forensic standards for digital chain of custody and cryptographic verification principles (RFC 6962 / EVM Provenance Standards).
          </div>
        </div>

        <div className="p-4 border-t border-blue-900/40 bg-[#050816]/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            I Acknowledge & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
