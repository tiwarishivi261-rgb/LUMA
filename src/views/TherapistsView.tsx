import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Stethoscope,
  MapPin,
  Phone,
  Star,
  ExternalLink,
  Search,
  ShieldCheck,
  RefreshCw,
  Building2,
  HeartHandshake,
  Heart,
  Loader2,
  Info,
  CheckCircle2,
  Navigation as NavIcon,
} from "lucide-react";
import { HealthcareProvider } from "../types";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "../components/PandaMascot";

interface TherapistsViewProps {
  onOpenCrisis: () => void;
}

const quickCities = [
  "Jaipur, Rajasthan",
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
  "Pune",
];

const categoryFilters = [
  { id: "all", label: "All Specialists", query: "mental health clinic psychiatrist therapist" },
  { id: "therapists", label: "Therapists & Psychologists", query: "clinical psychologist therapist counselor" },
  { id: "psychiatrists", label: "Psychiatrists & MDs", query: "psychiatrist mental health doctor clinic" },
  { id: "hospitals", label: "Hospitals & Institutes", query: "mental health hospital neuro sciences" },
  { id: "counseling", label: "Counseling & Wellness", query: "mental health counseling center" },
];

export const TherapistsView: React.FC<TherapistsViewProps> = ({ onOpenCrisis }) => {
  const [city, setCity] = useState("Jaipur, Rajasthan");
  const [activeCategory, setActiveCategory] = useState("all");
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attribution, setAttribution] = useState("Google Maps");
  const [savedProviderIds, setSavedProviderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("luma_saved_providers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchProviders = async (cityParam = city, categoryId = activeCategory) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const filter = categoryFilters.find((f) => f.id === categoryId) || categoryFilters[0];
      const url = `/api/places/nearby?city=${encodeURIComponent(cityParam)}&q=${encodeURIComponent(
        filter.query
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
    fetchProviders(city, activeCategory);
  }, []);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playPop();
    fetchProviders(city, activeCategory);
  };

  const handleCategorySelect = (categoryId: string) => {
    soundEngine.playPop();
    setActiveCategory(categoryId);
    fetchProviders(city, categoryId);
  };

  const handleQuickCityClick = (cityName: string) => {
    soundEngine.playPop();
    setCity(cityName);
    fetchProviders(cityName, activeCategory);
  };

  const toggleSaveProvider = (id: string) => {
    soundEngine.playPop();
    setSavedProviderIds((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      try {
        localStorage.setItem("luma_saved_providers", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Top Banner Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5 text-purple-300" />
              <span>Accredited Professional Support Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Find Nearby Therapists & Clinics
            </h1>
            <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
              LUMA is here as your daily mindfulness companion, but speaking with an accredited local psychologist,
              psychiatrist, or counseling clinic can provide profound personalized care. Explore verified clinics in{" "}
              <strong className="text-white underline decoration-purple-400 underline-offset-2">Jaipur, Rajasthan</strong> or your local city.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              id="therapists-crisis-button"
              onClick={onOpenCrisis}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>24/7 Crisis Helplines</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compassionate Clinical Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 leading-relaxed shadow-2xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Compassionate Healthcare Notice: </span>
          LUMA does not provide medical diagnoses or prescribe treatment. The facilities listed below are verified
          mental health practitioners and clinics discovered live through the <strong>Google Maps Places API</strong>.
          We encourage you to contact clinics directly to inquire about appointments, sliding-scale fees, and licensing.
        </div>
      </div>

      {/* Search & Location Filters */}
      <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <form onSubmit={handleCitySubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2.5 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 focus-within:border-purple-400 focus-within:bg-white transition-all shadow-inner">
            <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
            <input
              id="therapists-city-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city or district (e.g. Jaipur, Rajasthan)"
              className="w-full text-sm bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              id="therapists-search-submit-btn"
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Search Places</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCity("Jaipur, Rajasthan");
                fetchProviders("Jaipur, Rajasthan", activeCategory);
              }}
              title="Reset to default (Jaipur, Rajasthan)"
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick City Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">Popular Locations:</span>
          {quickCities.map((c) => (
            <button
              key={c}
              onClick={() => handleQuickCityClick(c)}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap font-medium ${
                city.toLowerCase().includes(c.toLowerCase().split(",")[0])
                  ? "bg-purple-100 text-purple-900 border-purple-300 font-semibold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-heading text-slate-800">
              Verified Clinics & Doctors in {city}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              {providers.length} found
            </span>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Powered by {attribution}
          </span>
        </div>

        {isLoading && (
          <div className="p-16 rounded-3xl bg-white border border-purple-100 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full border-3 border-purple-600 border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-slate-600">
              Fetching live accredited healthcare facilities in {city} via Google Maps...
            </p>
          </div>
        )}

        {errorMsg && !isLoading && (
          <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3 text-rose-900">
            <p className="text-sm">{errorMsg}</p>
            <button
              onClick={() => fetchProviders()}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !errorMsg && providers.length === 0 && (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No clinics found in this specific area</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Try typing a broader region like "Jaipur, Rajasthan" or selecting "All Specialists" from the category filter above.
            </p>
            <button
              onClick={() => {
                setCity("Jaipur, Rajasthan");
                fetchProviders("Jaipur, Rajasthan", "all");
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700"
            >
              Reset to Jaipur, Rajasthan
            </button>
          </div>
        )}

        {!isLoading && providers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((p) => {
              const isSaved = savedProviderIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    {/* Header with Title & Bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-bold text-slate-800 leading-snug">
                            {p.name}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        </div>

                        {p.distanceKm !== undefined && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-purple-700 font-medium">
                            <NavIcon className="w-3 h-3" />
                            <span>Approx. {p.distanceKm} km from center</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleSaveProvider(p.id)}
                        title={isSaved ? "Remove from saved providers" : "Save provider"}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isSaved
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : "bg-slate-50 text-slate-400 border-slate-200 hover:text-purple-600 hover:bg-purple-50"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? "fill-purple-600" : ""}`} />
                      </button>
                    </div>

                    {/* Rating & reviews */}
                    {p.rating && (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{p.rating.toFixed(1)}</span>
                        </div>
                        {p.userRatingCount && (
                          <span className="text-slate-500 text-xs">
                            Based on {p.userRatingCount.toLocaleString()} Google reviews
                          </span>
                        )}
                      </div>
                    )}

                    {/* Address */}
                    <div className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{p.address}</span>
                    </div>

                    {/* Phone */}
                    {p.phone && (
                      <div className="text-xs text-slate-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                        <a
                          href={`tel:${p.phone.replace(/\s+/g, "")}`}
                          className="font-semibold text-purple-700 hover:underline"
                        >
                          {p.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {p.phone ? (
                      <a
                        href={`tel:${p.phone.replace(/\s+/g, "")}`}
                        className="flex-1 py-2 px-3 rounded-2xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-purple-600" />
                        <span>Call Clinic</span>
                      </a>
                    ) : (
                      <div className="flex-1 py-2 px-3 rounded-2xl bg-slate-50 text-slate-400 text-xs text-center">
                        Phone upon inquiry
                      </div>
                    )}

                    {p.googleMapsUri && (
                      <a
                        href={p.googleMapsUri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-2xl bg-slate-900 text-white hover:bg-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verified Government & National Helplines Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-purple-950">
              National 24/7 Mental Health Helplines (Free & Confidential)
            </h3>
            <p className="text-xs text-purple-700">
              If you or someone you know needs immediate assistance, these accredited tele-counseling lifelines are available round the clock.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white border border-purple-100 space-y-1.5 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Government of India</div>
            <div className="text-sm font-extrabold text-slate-800">Tele-MANAS</div>
            <div className="text-xs text-purple-700 font-bold">14416 / 1800-891-4416</div>
            <div className="text-[10px] text-slate-500">24/7 Toll-free, 20+ Languages</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-purple-100 space-y-1.5 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Ministry of Social Justice</div>
            <div className="text-sm font-extrabold text-slate-800">KIRAN Helpline</div>
            <div className="text-xs text-purple-700 font-bold">1800-599-0019</div>
            <div className="text-[10px] text-slate-500">24/7 Support for distress & anxiety</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-purple-100 space-y-1.5 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">India Nationwide</div>
            <div className="text-sm font-extrabold text-slate-800">Vandrevala Foundation</div>
            <div className="text-xs text-purple-700 font-bold">9999 666 555</div>
            <div className="text-[10px] text-slate-500">24/7 Free crisis & emotional care</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-purple-100 space-y-1.5 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">US, Canada & Global</div>
            <div className="text-sm font-extrabold text-slate-800">Suicide & Crisis Lifeline</div>
            <div className="text-xs text-purple-700 font-bold">Dial 988 or Text HOME to 741741</div>
            <div className="text-[10px] text-slate-500">24/7 English, Spanish & TTY</div>
          </div>
        </div>
      </div>
    </div>
  );
};
