import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Phone,
  Star,
  ExternalLink,
  ShieldCheck,
  Search,
  X,
  Building2,
  Stethoscope,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { HealthcareProvider } from "../types";
import { soundEngine } from "../utils/audio";

interface ProfessionalSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity?: string;
  onSelectProvider?: (provider: HealthcareProvider) => void;
}

export const ProfessionalSupportModal: React.FC<ProfessionalSupportModalProps> = ({
  isOpen,
  onClose,
  defaultCity = "Jaipur, Rajasthan",
}) => {
  const [city, setCity] = useState(defaultCity);
  const [searchQuery, setSearchQuery] = useState("mental health clinic psychiatrist therapist");
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attribution, setAttribution] = useState("Google Maps");

  const fetchProviders = async (cityParam = city, queryParam = searchQuery) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const url = `/api/places/nearby?city=${encodeURIComponent(cityParam)}&q=${encodeURIComponent(
        queryParam
      )}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Unable to fetch nearby healthcare providers");
      }
      const data = await res.json();
      setProviders(data.places || []);
      if (data.attribution) setAttribution(data.attribution);
    } catch (err: any) {
      console.error("Error fetching places:", err);
      setErrorMsg("Unable to retrieve nearby providers right now. Please try again or consult local directories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
    }
  }, [isOpen]);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playPop();
    fetchProviders(city, searchQuery);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22 }}
            className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-purple-100 relative overflow-hidden"
          >
            {/* Top Bar Header */}
            <div className="p-5 sm:p-6 border-b border-purple-100/80 bg-white/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-50 border border-purple-200 text-purple-700 flex items-center justify-center shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-800">
                    Find Professional Support Near You
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified nearby mental-health professionals, clinics & hospitals
                  </p>
                </div>
              </div>
              <button
                id="close-prof-support-modal-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Non-clinical disclaimer banner */}
            <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-100 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed shrink-0">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Compassionate Notice:</strong> LUMA never claims a specific doctor is best, nor provides medical diagnoses. We provide live directory information via Google Maps so you can contact accredited local professionals directly.
              </span>
            </div>

            {/* Search & Location Filter Bar */}
            <form
              onSubmit={handleCitySubmit}
              className="p-4 bg-white/60 border-b border-purple-100/60 flex flex-col sm:flex-row gap-2 shrink-0"
            >
              <div className="flex-1 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 focus-within:border-purple-300 focus-within:bg-white transition-all">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                <input
                  id="prof-support-city-input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Location (e.g. Jaipur, Rajasthan)"
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>Search Area</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCity("Jaipur, Rajasthan");
                    fetchProviders("Jaipur, Rajasthan", searchQuery);
                  }}
                  title="Reset to default (Jaipur, Rajasthan)"
                  className="p-2 rounded-2xl border border-slate-200 bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 text-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Providers Results List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {isLoading && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                  <p className="text-xs text-slate-500 font-medium">
                    Contacting Google Maps Places directory for accredited providers in {city}...
                  </p>
                </div>
              )}

              {errorMsg && !isLoading && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-center space-y-2">
                  <p>{errorMsg}</p>
                  <button
                    onClick={() => fetchProviders()}
                    className="px-3 py-1 rounded-full bg-rose-200 hover:bg-rose-300 font-medium text-[11px] text-rose-900"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isLoading && !errorMsg && providers.length === 0 && (
                <div className="py-12 text-center space-y-2">
                  <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">No clinics found nearby</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Try entering a broader district like "Jaipur, Rajasthan" or searching for major hospitals.
                  </p>
                </div>
              )}

              {!isLoading &&
                providers.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 sm:max-w-[70%]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-800">{p.name}</h4>
                        {p.distanceKm !== undefined && (
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-full">
                            ~{p.distanceKm} km away
                          </span>
                        )}
                        {p.rating && (
                          <div className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{p.rating.toFixed(1)}</span>
                            {p.userRatingCount && (
                              <span className="text-slate-400 text-[10px]">
                                ({p.userRatingCount})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{p.address}</span>
                      </p>

                      {p.phone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <a
                            href={`tel:${p.phone.replace(/\s+/g, "")}`}
                            className="text-purple-700 hover:underline font-medium"
                          >
                            {p.phone}
                          </a>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {p.phone && (
                        <a
                          href={`tel:${p.phone.replace(/\s+/g, "")}`}
                          className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-purple-600" />
                          <span>Call Clinic</span>
                        </a>
                      )}

                      {p.googleMapsUri && (
                        <a
                          href={p.googleMapsUri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-purple-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span>Open in Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer with Google Maps Attribution */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified medical directory via Google Maps Places API</span>
              </div>
              <span className="font-semibold text-slate-600">Powered by {attribution}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
