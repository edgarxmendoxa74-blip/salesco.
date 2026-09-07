import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface ConsentNoticeModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConsentNoticeModal: React.FC<ConsentNoticeModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-amber-600">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Call Recording & Privacy Consent</h3>
            <p className="text-xs text-amber-600 font-medium">Legal Compliance Notice</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            Recording or analyzing call audio may be subject to applicable privacy laws (such as two-party consent regulations).
          </p>
          <p className="text-slate-400">
            Ensure all required participants are properly notified before initiating call recording or live speech transcription.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold border border-slate-200"
          >
            Cancel Session
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            I Agree & Start
          </button>
        </div>
      </div>
    </div>
  );
};
