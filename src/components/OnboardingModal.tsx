import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Sparkles, Smartphone, ShieldCheck, Heart, RefreshCw } from "lucide-react";
import { UserProfile } from "../types";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "./PandaMascot";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
}

const intentionOptions = [
  { id: "anxiety", label: "Easing Everyday Anxiety", emoji: "🌿" },
  { id: "peace", label: "Cultivating Daily Peace", emoji: "☁️" },
  { id: "overthinking", label: "Quieting An Overactive Mind", emoji: "🧘" },
  { id: "sleep", label: "Unwinding For Deep Sleep", emoji: "🌙" },
  { id: "gratitude", label: "Nurturing Self-Compassion", emoji: "🌸" },
];

const avatarOptions = [
  { code: "🐼", name: "Mindful Panda" },
  { code: "🐨", name: "Cozy Koala" },
  { code: "🦙", name: "Calm Llama" },
  { code: "🦦", name: "Mellow Otter" },
  { code: "🦊", name: "Hopeful Fox" },
  { code: "🐰", name: "Gentle Bunny" },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<"welcome" | "phone" | "otp" | "profile" | "intention">("welcome");
  const [name, setName] = useState<string>("Alex");
  const [phone, setPhone] = useState<string>("+1 (555) 389-2041");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [otpError, setOtpError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("🐼");
  const [selectedIntention, setSelectedIntention] = useState<string>("Easing Everyday Anxiety");

  useEffect(() => {
    let interval: any;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.length < 7) return;
    soundEngine.playPop();
    setStep("otp");
    setResendTimer(30);
    setCanResend(false);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setOtpError("");

    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyOtp = () => {
    const fullCode = otp.join("");
    // Accept test codes or any 4 digit sequence
    if (fullCode.length < 4) {
      setOtpError("Please enter all 4 digits");
      return;
    }
    soundEngine.playPop();
    setStep("profile");
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    soundEngine.playPop();
    setResendTimer(30);
    setCanResend(false);
    setOtpError("New code sent! (Hint: use 1-2-3-4 or any 4 digits)");
  };

  const handleFinish = () => {
    soundEngine.playChime(528, 2.5);
    const profile: UserProfile = {
      name: name.trim() || "Friend",
      phone: phone,
      avatar: selectedAvatar,
      intention: selectedIntention,
      joinDate: new Date().toISOString(),
      streak: 1,
      longestStreak: 1,
      totalMindfulMinutes: 5,
      preferences: {
        soundEffects: true,
        dailyReminderTime: "20:00",
        anonymousMode: true,
        softChimes: true,
      },
    };
    onComplete(profile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="bg-[#FFFDF9] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-purple-100 relative"
      >
        {/* Step 1: Welcome */}
        {step === "welcome" && (
          <div className="text-center py-4">
            <PandaMascot mood="waving" size="lg" className="mx-auto mb-4" />
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold tracking-wide uppercase">
              Meet LUMA
            </span>
            <h2 className="text-2xl font-bold font-heading text-slate-800 mt-3 mb-2">
              Your Warm Wellness Companion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
              A soft, supportive space to check in with your mind, track your emotional rhythm, breathe, and unwind with gentle guidance.
            </p>
            <button
              id="onboarding-get-started-btn"
              onClick={() => {
                soundEngine.playPop();
                setStep("phone");
              }}
              className="w-full py-3 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Begin Your Journey
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Phone Authentication */}
        {step === "phone" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-800">
                  Welcome to LUMA
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your number to secure your private journal & rhythm
                </p>
              </div>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone-number-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  We keep your info confidential. No spam, ever.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  id="skip-auth-btn"
                  onClick={() => {
                    soundEngine.playPop();
                    setStep("profile");
                  }}
                  className="text-xs text-slate-500 hover:text-purple-600 transition-colors"
                >
                  Skip for now (Guest)
                </button>
                <button
                  type="submit"
                  id="send-otp-btn"
                  className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  Send Verification Code
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: OTP Verification */}
        {step === "otp" && (
          <div>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-800">
                Enter Verification Code
              </h3>
              <p className="text-xs text-slate-500">
                We sent a 4-digit code to <strong>{phone}</strong>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-2xl bg-white border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-center text-rose-500 mb-3 font-medium">
                {otpError}
              </p>
            )}

            <div className="text-center mb-6">
              {canResend ? (
                <button
                  type="button"
                  id="resend-otp-btn"
                  onClick={handleResendOtp}
                  className="text-xs text-purple-600 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Code
                </button>
              ) : (
                <span className="text-xs text-slate-400">
                  Resend code in {resendTimer}s
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Change Number
              </button>
              <button
                type="button"
                id="verify-otp-btn"
                onClick={verifyOtp}
                className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                Verify & Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Profile & Avatar Setup */}
        {step === "profile" && (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold font-heading text-slate-800">
                What should LUMA call you?
              </h3>
              <p className="text-xs text-slate-500">
                Choose a warm name and companion avatar
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Preferred Name
              </label>
              <input
                id="profile-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya, Jordan, Alex"
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Choose Your Inner Animal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {avatarOptions.map((av) => (
                  <button
                    key={av.code}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      setSelectedAvatar(av.code);
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedAvatar === av.code
                        ? "bg-purple-50 border-purple-400 ring-2 ring-purple-200 shadow-xs"
                        : "bg-white border-slate-200 hover:border-purple-200"
                    }`}
                  >
                    <span className="text-2xl">{av.code}</span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {av.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              id="profile-next-btn"
              onClick={() => {
                soundEngine.playPop();
                setStep("intention");
              }}
              className="w-full py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              Continue to Intentions
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 5: Focus Intention */}
        {step === "intention" && (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold font-heading text-slate-800">
                What brings you to LUMA today?
              </h3>
              <p className="text-xs text-slate-500">
                We'll tailor your daily check-ins and recommendations
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {intentionOptions.map((opt) => {
                const active = selectedIntention === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      setSelectedIntention(opt.label);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? "bg-purple-50 border-purple-400 ring-2 ring-purple-200 text-purple-900"
                        : "bg-white border-slate-200 text-slate-700 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-xs font-semibold">{opt.label}</span>
                    </div>
                    {active && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })}
            </div>

            <button
              id="finish-onboarding-btn"
              onClick={handleFinish}
              className="w-full py-3 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Enter LUMA
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
