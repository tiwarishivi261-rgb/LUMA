import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { HeartHandshake, PhoneCall, ShieldAlert, X, Sparkles, Wind } from "lucide-react";

interface CrisisSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBreathing?: () => void;
}

export const CrisisSupportModal: React.FC<CrisisSupportModalProps> = ({
  isOpen,
  onClose,
  onStartBreathing,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 relative overflow-hidden"
          >
            {/* Top gradient highlight */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-300 via-purple-300 to-indigo-300" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-800">
                    You Are Not Alone
                  </h3>
                  <p className="text-xs text-slate-500">
                    Free, confidential, and compassionate 24/7 support
                  </p>
                </div>
              </div>
              <button
                id="close-crisis-modal-btn"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-3.5 mb-5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Important:</strong> LUMA is a gentle everyday companion for mindfulness and self-reflection, not a medical or clinical replacement. If you are in distress, professional support is ready right now.
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {/* 988 Lifeline */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-between hover:border-purple-300 transition-colors">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    988 Suicide & Crisis Lifeline
                  </div>
                  <div className="text-xs text-slate-500">
                    USA & Canada (Call or Text, English & Spanish)
                  </div>
                </div>
                <a
                  id="call-988-link"
                  href="tel:988"
                  className="px-3.5 py-1.5 rounded-full bg-rose-500 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-rose-600 transition-colors shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call 988
                </a>
              </div>

              {/* Crisis Text Line */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-between hover:border-purple-300 transition-colors">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    Crisis Text Line
                  </div>
                  <div className="text-xs text-slate-500">
                    Text <strong>HOME</strong> to <strong>741741</strong> (24/7 Free)
                  </div>
                </div>
                <a
                  id="sms-crisis-link"
                  href="sms:741741?body=HOME"
                  className="px-3.5 py-1.5 rounded-full bg-purple-600 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-purple-700 transition-colors shadow-xs"
                >
                  Text 741741
                </a>
              </div>

              {/* International Lines */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    UK & International
                  </div>
                  <div className="text-xs text-slate-500">
                    UK NHS: <strong>111</strong> | India: <strong>9152987821</strong>
                  </div>
                </div>
                <a
                  id="find-a-helpline-link"
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-300 transition-colors"
                >
                  Find Worldwide
                </a>
              </div>
            </div>

            {/* Grounding action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                id="crisis-breathing-action-btn"
                onClick={() => {
                  onClose();
                  if (onStartBreathing) onStartBreathing();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Wind className="w-4 h-4" />
                Need a grounding breath right now? Try 4-7-8
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
