import React, {useMemo, useState} from 'react';
import {Globe, Loader2, MapPin, Search, X} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {PRESET_CITIES, searchPlacesOnline} from '../lib/prayerUtils';
import type {LocationConfig} from '../types/islamic';

interface LocationPickerModalProps {
  open: boolean;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({open, onClose}) => {
  const {state, updateSettings, detectGPSLocation} = useSkNur();
  const isBn = state.settings.language === 'bn';

  const [regionFilter, setRegionFilter] = useState<'India' | 'Bangladesh' | 'Global' | 'All'>('India');
  const [query, setQuery] = useState('');
  const [onlineResults, setOnlineResults] = useState<LocationConfig[]>([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const filteredPresets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRESET_CITIES.filter((c) => {
      if (regionFilter === 'India' && c.country !== 'India') return false;
      if (regionFilter === 'Bangladesh' && c.country !== 'Bangladesh') return false;
      if (regionFilter === 'Global' && (c.country === 'India' || c.country === 'Bangladesh')) {
        return false;
      }
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
    });
  }, [regionFilter, query]);

  if (!open) return null;

  const handleSelectCity = (city: LocationConfig) => {
    updateSettings({location: city});
    onClose();
  };

  const handleGPS = async () => {
    setGpsLoading(true);
    setStatusMsg(null);
    try {
      const locName = await detectGPSLocation();
      setStatusMsg(isBn ? `লোকেশন আপডেট হয়েছে: ${locName}` : `Updated: ${locName}`);
      onClose();
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : 'GPS failed');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleOnlineSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearchingOnline(true);
    setStatusMsg(null);
    try {
      const searchString =
        regionFilter === 'India' && !term.toLowerCase().includes('india')
          ? `${term}, India`
          : regionFilter === 'Bangladesh' && !term.toLowerCase().includes('bangladesh')
            ? `${term}, Bangladesh`
            : term;
      const results = await searchPlacesOnline(searchString);
      setOnlineResults(results);
      if (results.length === 0) {
        setStatusMsg(
          isBn
            ? 'কোনো স্থান পাওয়া যায়নি। অন্য নাম বা জেলার নাম লিখে চেষ্টা করুন।'
            : 'No matching location found. Try another city or district name.'
        );
      }
    } catch {
      setStatusMsg(
        isBn
          ? 'অনলাইন লোকেশন সার্চ এই মুহূর্তে উপলব্ধ নয়।'
          : 'Online location search is unavailable offline.'
      );
    } finally {
      setSearchingOnline(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl max-h-[88vh] rounded-3xl bg-white dark:bg-[#0A221B] border border-slate-200 dark:border-emerald-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-emerald-900/60 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? 'আপনার লোকেশন নির্বাচন করুন (ইন্ডিয়া ও বাংলাদেশ)' : 'Select Location (India, Bangladesh & Global)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn
                ? `বর্তমান লোকেশন: ${state.settings.location.name}, ${state.settings.location.country}`
                : `Current: ${state.settings.location.name}, ${state.settings.location.country}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location modal"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-emerald-900/50 text-slate-600 dark:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & GPS Controls */}
        <div className="p-4 sm:p-5 space-y-3 border-b border-slate-100 dark:border-emerald-900/60">
          <div className="flex flex-wrap gap-2">
            {[
              {id: 'India', label: isBn ? 'ইন্ডিয়া (India)' : 'India'},
              {id: 'Bangladesh', label: isBn ? 'বাংলাদেশ (BD)' : 'Bangladesh'},
              {id: 'Global', label: isBn ? 'আন্তর্জাতিক' : 'Global'},
              {id: 'All', label: isBn ? 'সবগুলো' : 'All'},
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRegionFilter(tab.id as typeof regionFilter)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold min-h-[40px] ${
                  regionFilter === tab.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 dark:bg-emerald-950 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleGPS}
              disabled={gpsLoading}
              className="ml-auto px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#042F24] text-xs font-bold flex items-center gap-1.5 min-h-[40px]"
            >
              {gpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              <span>{isBn ? 'অটো GPS' : 'Auto GPS'}</span>
            </button>
          </div>

          <form onSubmit={handleOnlineSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isBn
                    ? 'ইন্ডিয়া বা বাংলাদেশের যেকোনো শহর/জেলা/গ্রাম খুঁজুন...'
                    : 'Search any city, district, or town in India / Bangladesh...'
                }
                className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={searchingOnline || !query.trim()}
              className="min-h-[44px] px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              {searchingOnline ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              <span>{isBn ? 'অনলাইন খুঁজুন' : 'Search All'}</span>
            </button>
          </form>

          {statusMsg && <p className="text-xs text-emerald-700 dark:text-emerald-300">{statusMsg}</p>}
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {onlineResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-800 dark:text-[#F5E6BE]">
                {isBn ? 'অনলাইন সার্চ ফলাফল (সিলেক্ট করতে ট্যাপ করুন):' : 'Online Search Results:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onlineResults.map((city, idx) => (
                  <button
                    key={`${city.name}-${idx}`}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className="text-left p-3 rounded-xl border border-emerald-600/40 bg-emerald-50/70 dark:bg-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-colors min-h-[52px]"
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{city.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      {city.country} · {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredPresets.map((city) => {
              const isSelected =
                state.settings.location.name === city.name &&
                state.settings.location.country === city.country;
              return (
                <button
                  key={`${city.country}-${city.name}`}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className={`text-left p-3 rounded-xl border transition-colors min-h-[52px] flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'border-slate-200 dark:border-emerald-900/60 hover:bg-slate-50 dark:hover:bg-emerald-950/60'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{city.name}</p>
                    <p className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {city.country}
                    </p>
                  </div>
                  <MapPin className="w-4 h-4 shrink-0 opacity-75" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
