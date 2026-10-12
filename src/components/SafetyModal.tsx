import React from 'react';
import { X, Phone, MessageSquare, ExternalLink, ShieldAlert, HeartHandshake } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-serif font-bold text-stone-900">
              Immediate Help & Support
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          If you or someone you know is struggling or in crisis, help is available. You are not alone. Please reach out to compassionate, trained individuals who can support you right now.
        </p>

        {/* Crisis Hotlines */}
        <div className="space-y-3">
          <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                988 Suicide & Crisis Lifeline
              </span>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Call or text <strong>988</strong> (USA & Canada). Free, confidential, available 24/7.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                Crisis Text Line
              </span>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Text <strong>HOME to 741741</strong> to connect with a crisis counselor 24/7.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-700 text-white flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                International Helplines
              </span>
              <p className="text-[11px] text-stone-600 mt-0.5">
                UK: Call 111 or 999. Worldwide directories are available at{' '}
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#2C6E72] underline inline-flex items-center gap-0.5"
                >
                  findahelpline.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-stone-500 leading-relaxed bg-[#FAF9F5] p-3 rounded-xl border border-stone-200/50">
          <strong>Product notice:</strong> TheraApp supports structured self-reflection and is not a substitute for professional mental-health care, diagnosis, or emergency support.
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
