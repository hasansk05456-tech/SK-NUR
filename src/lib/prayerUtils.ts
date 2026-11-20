import {
  CalculationMethod,
  Coordinates,
  Madhab,
  Prayer,
  PrayerTimes,
  Qibla,
  SunnahTimes,
} from 'adhan';
import type {CalculationMethodKey, LocationConfig, MadhabKey} from '../types/islamic';

export const PRESET_CITIES: LocationConfig[] = [
  // India — West Bengal (পশ্চিমবঙ্গ)
  {name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639, isAutoGPS: false},
  {name: 'Howrah', country: 'India', latitude: 22.5958, longitude: 88.2636, isAutoGPS: false},
  {name: 'Murshidabad (Baharampur)', country: 'India', latitude: 24.0989, longitude: 88.2679, isAutoGPS: false},
  {name: 'Malda', country: 'India', latitude: 25.0108, longitude: 88.1411, isAutoGPS: false},
  {name: 'Nadia (Krishnanagar)', country: 'India', latitude: 23.4013, longitude: 88.5021, isAutoGPS: false},
  {name: 'North 24 Parganas (Barasat)', country: 'India', latitude: 22.7228, longitude: 88.4806, isAutoGPS: false},
  {name: 'South 24 Parganas (Baruipur)', country: 'India', latitude: 22.3654, longitude: 88.4326, isAutoGPS: false},
  {name: 'Hooghly (Chinsurah)', country: 'India', latitude: 22.9012, longitude: 88.3899, isAutoGPS: false},
  {name: 'Purba Bardhaman', country: 'India', latitude: 23.2324, longitude: 87.8615, isAutoGPS: false},
  {name: 'Asansol', country: 'India', latitude: 23.6739, longitude: 86.9524, isAutoGPS: false},
  {name: 'Durgapur', country: 'India', latitude: 23.5204, longitude: 87.3119, isAutoGPS: false},
  {name: 'Birbhum (Suri)', country: 'India', latitude: 23.9056, longitude: 87.5269, isAutoGPS: false},
  {name: 'Bankura', country: 'India', latitude: 23.2313, longitude: 87.0784, isAutoGPS: false},
  {name: 'Purulia', country: 'India', latitude: 23.3322, longitude: 86.3616, isAutoGPS: false},
  {name: 'Paschim Medinipur', country: 'India', latitude: 22.4257, longitude: 87.3199, isAutoGPS: false},
  {name: 'Purba Medinipur (Tamluk)', country: 'India', latitude: 22.2977, longitude: 87.9212, isAutoGPS: false},
  {name: 'Jhargram', country: 'India', latitude: 22.455, longitude: 86.9974, isAutoGPS: false},
  {name: 'Uttar Dinajpur (Raiganj)', country: 'India', latitude: 25.6164, longitude: 88.126, isAutoGPS: false},
  {name: 'Dakshin Dinajpur (Balurghat)', country: 'India', latitude: 25.2316, longitude: 88.777, isAutoGPS: false},
  {name: 'Siliguri', country: 'India', latitude: 26.7271, longitude: 88.3953, isAutoGPS: false},
  {name: 'Jalpaiguri', country: 'India', latitude: 26.5435, longitude: 88.7196, isAutoGPS: false},
  {name: 'Cooch Behar', country: 'India', latitude: 26.3452, longitude: 89.4482, isAutoGPS: false},
  {name: 'Alipurduar', country: 'India', latitude: 26.489, longitude: 89.5271, isAutoGPS: false},
  {name: 'Darjeeling', country: 'India', latitude: 27.041, longitude: 88.2663, isAutoGPS: false},
  // India — Major Cities & States
  {name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.209, isAutoGPS: false},
  {name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, isAutoGPS: false},
  {name: 'Hyderabad', country: 'India', latitude: 17.385, longitude: 78.4867, isAutoGPS: false},
  {name: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946, isAutoGPS: false},
  {name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707, isAutoGPS: false},
  {name: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462, isAutoGPS: false},
  {name: 'Aligarh', country: 'India', latitude: 27.8974, longitude: 78.088, isAutoGPS: false},
  {name: 'Deoband', country: 'India', latitude: 29.6952, longitude: 77.6787, isAutoGPS: false},
  {name: 'Kanpur', country: 'India', latitude: 26.4499, longitude: 80.3319, isAutoGPS: false},
  {name: 'Agra', country: 'India', latitude: 27.1767, longitude: 78.0081, isAutoGPS: false},
  {name: 'Varanasi', country: 'India', latitude: 25.3176, longitude: 82.9739, isAutoGPS: false},
  {name: 'Prayagraj', country: 'India', latitude: 25.4358, longitude: 81.8463, isAutoGPS: false},
  {name: 'Bareilly', country: 'India', latitude: 28.367, longitude: 79.4304, isAutoGPS: false},
  {name: 'Moradabad', country: 'India', latitude: 28.8386, longitude: 78.7733, isAutoGPS: false},
  {name: 'Azamgarh', country: 'India', latitude: 26.0737, longitude: 83.1859, isAutoGPS: false},
  {name: 'Patna', country: 'India', latitude: 25.5941, longitude: 85.1376, isAutoGPS: false},
  {name: 'Kishanganj', country: 'India', latitude: 26.1038, longitude: 87.9479, isAutoGPS: false},
  {name: 'Darbhanga', country: 'India', latitude: 26.1542, longitude: 85.8918, isAutoGPS: false},
  {name: 'Ranchi', country: 'India', latitude: 23.3441, longitude: 85.3096, isAutoGPS: false},
  {name: 'Jamshedpur', country: 'India', latitude: 22.8046, longitude: 86.2029, isAutoGPS: false},
  {name: 'Dhanbad', country: 'India', latitude: 23.7957, longitude: 86.4304, isAutoGPS: false},
  {name: 'Bhubaneswar', country: 'India', latitude: 20.2961, longitude: 85.8245, isAutoGPS: false},
  {name: 'Cuttack', country: 'India', latitude: 20.4625, longitude: 85.883, isAutoGPS: false},
  {name: 'Guwahati', country: 'India', latitude: 26.1445, longitude: 91.7362, isAutoGPS: false},
  {name: 'Silchar', country: 'India', latitude: 24.8333, longitude: 92.7789, isAutoGPS: false},
  {name: 'Dhubri', country: 'India', latitude: 26.0207, longitude: 89.9743, isAutoGPS: false},
  {name: 'Agartala', country: 'India', latitude: 23.8315, longitude: 91.2868, isAutoGPS: false},
  {name: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714, isAutoGPS: false},
  {name: 'Surat', country: 'India', latitude: 21.1702, longitude: 72.8311, isAutoGPS: false},
  {name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567, isAutoGPS: false},
  {name: 'Nagpur', country: 'India', latitude: 21.1458, longitude: 79.0882, isAutoGPS: false},
  {name: 'Aurangabad', country: 'India', latitude: 19.8762, longitude: 75.3433, isAutoGPS: false},
  {name: 'Bhopal', country: 'India', latitude: 23.2599, longitude: 77.4126, isAutoGPS: false},
  {name: 'Indore', country: 'India', latitude: 22.7196, longitude: 75.8577, isAutoGPS: false},
  {name: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873, isAutoGPS: false},
  {name: 'Ajmer', country: 'India', latitude: 26.4499, longitude: 74.6399, isAutoGPS: false},
  {name: 'Srinagar', country: 'India', latitude: 34.0837, longitude: 74.7973, isAutoGPS: false},
  {name: 'Jammu', country: 'India', latitude: 32.7266, longitude: 74.857, isAutoGPS: false},
  {name: 'Kozhikode', country: 'India', latitude: 11.2588, longitude: 75.7804, isAutoGPS: false},
  {name: 'Malappuram', country: 'India', latitude: 11.051, longitude: 76.0711, isAutoGPS: false},
  {name: 'Kochi', country: 'India', latitude: 9.9312, longitude: 76.2673, isAutoGPS: false},
  {name: 'Thiruvananthapuram', country: 'India', latitude: 8.5241, longitude: 76.9366, isAutoGPS: false},
  {name: 'Chandigarh', country: 'India', latitude: 30.7333, longitude: 76.7794, isAutoGPS: false},
  {name: 'Raipur', country: 'India', latitude: 21.2514, longitude: 81.6296, isAutoGPS: false},
  // Bangladesh
  {name: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, isAutoGPS: false},
  {name: 'Chattogram', country: 'Bangladesh', latitude: 22.3569, longitude: 91.7832, isAutoGPS: false},
  {name: 'Sylhet', country: 'Bangladesh', latitude: 24.8949, longitude: 91.8687, isAutoGPS: false},
  {name: 'Rajshahi', country: 'Bangladesh', latitude: 24.3745, longitude: 88.6042, isAutoGPS: false},
  {name: 'Khulna', country: 'Bangladesh', latitude: 22.8456, longitude: 89.5403, isAutoGPS: false},
  {name: 'Barishal', country: 'Bangladesh', latitude: 22.701, longitude: 90.3535, isAutoGPS: false},
  {name: 'Rangpur', country: 'Bangladesh', latitude: 25.7439, longitude: 89.2752, isAutoGPS: false},
  {name: 'Mymensingh', country: 'Bangladesh', latitude: 24.7471, longitude: 90.4203, isAutoGPS: false},
  // Global
  {name: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, isAutoGPS: false},
  {name: 'Madinah', country: 'Saudi Arabia', latitude: 24.4672, longitude: 39.6111, isAutoGPS: false},
  {name: 'London', country: 'United Kingdom', latitude: 51.5072, longitude: -0.1276, isAutoGPS: false},
  {name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, isAutoGPS: false},
  {name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, isAutoGPS: false},
  {name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.139, longitude: 101.6869, isAutoGPS: false},
];

export async function searchPlacesOnline(query: string): Promise<LocationConfig[]> {
  const clean = query.trim();
  if (!clean) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(clean)}`;
  const res = await fetch(url, {
    headers: {'Accept-Language': 'en'},
  });
  if (!res.ok) throw new Error('Location search service unavailable');
  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      state_district?: string;
      state?: string;
      country?: string;
    };
  }>;
  return data.map((item) => {
    const addr = item.address || {};
    const primary =
      addr.city || addr.town || addr.village || addr.state_district || item.display_name.split(',')[0];
    const regionPart = addr.state ? `${primary}, ${addr.state}` : primary;
    return {
      name: regionPart,
      country: addr.country || 'India',
      latitude: Number(item.lat),
      longitude: Number(item.lon),
      isAutoGPS: false,
    };
  });
}

export async function reverseGeocodeLocation(
  lat: number,
  lng: number
): Promise<{name: string; country: string} | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;
    const res = await fetch(url, {headers: {'Accept-Language': 'en'}});
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        state_district?: string;
        state?: string;
        country?: string;
      };
    };
    const addr = data.address;
    if (!addr) return null;
    const locality = addr.city || addr.town || addr.village || addr.state_district || addr.state;
    if (!locality) return null;
    const label = addr.state && locality !== addr.state ? `${locality}, ${addr.state}` : locality;
    return {name: label, country: addr.country || 'Current Location'};
  } catch {
    return null;
  }
}

export const CALCULATION_METHODS: {key: CalculationMethodKey; label: string; region: string}[] = [
  {key: 'Karachi', label: 'University of Islamic Sciences, Karachi', region: 'Bangladesh, South Asia'},
  {key: 'MuslimWorldLeague', label: 'Muslim World League (MWL)', region: 'Global Standard'},
  {key: 'UmmAlQura', label: 'Umm al-Qura University', region: 'Makkah / Saudi Arabia'},
  {key: 'Egyptian', label: 'Egyptian General Authority', region: 'Egypt & Africa'},
  {key: 'NorthAmerica', label: 'ISNA (Islamic Society of North America)', region: 'North America'},
  {key: 'Singapore', label: 'MUIS Singapore', region: 'Southeast Asia'},
  {key: 'Tehran', label: 'Institute of Geophysics, Tehran', region: 'Iran'},
  {key: 'Turkey', label: 'Diyanet İşleri Başkanlığı', region: 'Turkey & Europe'},
];

function getCalculationParams(method: CalculationMethodKey, madhab: MadhabKey) {
  let params;
  switch (method) {
    case 'Karachi':
      params = CalculationMethod.Karachi();
      break;
    case 'UmmAlQura':
      params = CalculationMethod.UmmAlQura();
      break;
    case 'Egyptian':
      params = CalculationMethod.Egyptian();
      break;
    case 'NorthAmerica':
      params = CalculationMethod.NorthAmerica();
      break;
    case 'Singapore':
      params = CalculationMethod.Singapore();
      break;
    case 'Tehran':
      params = CalculationMethod.Tehran();
      break;
    case 'Turkey':
      params = CalculationMethod.Turkey();
      break;
    case 'MuslimWorldLeague':
    default:
      params = CalculationMethod.MuslimWorldLeague();
      break;
  }
  params.madhab = madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

export interface ComputedPrayerDay {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  middleOfTheNight: Date;
  lastThirdOfTheNight: Date;
  currentPrayer: string;
  nextPrayer: string;
  nextPrayerTime: Date;
}

const PRAYER_NAMES_MAP: Record<string, string> = {
  [Prayer.Fajr]: 'Fajr',
  [Prayer.Sunrise]: 'Sunrise',
  [Prayer.Dhuhr]: 'Dhuhr',
  [Prayer.Asr]: 'Asr',
  [Prayer.Maghrib]: 'Maghrib',
  [Prayer.Isha]: 'Isha',
  [Prayer.None]: 'None',
};

export function computePrayerDay(
  date: Date,
  lat: number,
  lng: number,
  method: CalculationMethodKey,
  madhab: MadhabKey
): ComputedPrayerDay {
  const coords = new Coordinates(lat, lng);
  const params = getCalculationParams(method, madhab);
  const pt = new PrayerTimes(coords, date, params);
  const sunnah = new SunnahTimes(pt);

  const cur = pt.currentPrayer(date);
  let nxt = pt.nextPrayer(date);
  let nxtTime = pt.timeForPrayer(nxt);

  if (nxt === Prayer.None || !nxtTime) {
    const tomorrow = new Date(date.getTime() + 86400000);
    const tomorrowPt = new PrayerTimes(coords, tomorrow, params);
    nxt = Prayer.Fajr;
    nxtTime = tomorrowPt.fajr;
  }

  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
    middleOfTheNight: sunnah.middleOfTheNight,
    lastThirdOfTheNight: sunnah.lastThirdOfTheNight,
    currentPrayer: PRAYER_NAMES_MAP[cur] || 'None',
    nextPrayer: PRAYER_NAMES_MAP[nxt] || 'Fajr',
    nextPrayerTime: nxtTime,
  };
}

export function getQiblaAngle(lat: number, lng: number): number {
  const coords = new Coordinates(lat, lng);
  return Qibla(coords);
}

export function getDistanceToMakkahKm(lat: number, lng: number): number {
  const R = 6371;
  const makkahLat = 21.4225;
  const makkahLng = 39.8262;
  const dLat = ((makkahLat - lat) * Math.PI) / 180;
  const dLon = ((makkahLng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((makkahLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});
}

export function formatCountdown(targetDate: Date, now: Date): string {
  const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getHijriDateInfo(date: Date): {
  formattedEn: string;
  formattedAr: string;
  day: number;
  monthIndex: number;
  monthNameEn: string;
  year: number;
} {
  try {
    const enFmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const arFmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(date);

    const day = Number(parts.find((p) => p.type === 'day')?.value || 1);
    const monthIndex = Number(parts.find((p) => p.type === 'month')?.value || 1);
    const year = Number(parts.find((p) => p.type === 'year')?.value || 1448);
    const monthNameEn =
      new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {month: 'long'}).format(date);

    return {
      formattedEn: enFmt.format(date),
      formattedAr: arFmt.format(date),
      day,
      monthIndex,
      monthNameEn,
      year,
    };
  } catch {
    return {
      formattedEn: 'Islamic Calendar',
      formattedAr: 'التقويم الهجري',
      day: 1,
      monthIndex: 1,
      monthNameEn: 'Muharram',
      year: 1448,
    };
  }
}

const BENGALI_MONTHS = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র',
];

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)] || d);
}

export function getBengaliDateInfo(date: Date): {
  day: number;
  monthName: string;
  year: number;
  formattedBn: string;
} {
  const gYear = date.getFullYear();
  const isLeap = (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;
  // Revised Bangla Academy calendar: Pohela Boishakh is April 14
  const startOfBanglaYear = new Date(gYear, 3, 14);
  let banglaYear = gYear - 593;
  let refStart = startOfBanglaYear;
  if (date < startOfBanglaYear) {
    banglaYear -= 1;
    refStart = new Date(gYear - 1, 3, 14);
  }
  const prevIsLeap =
    date < startOfBanglaYear
      ? ((gYear - 1) % 4 === 0 && (gYear - 1) % 100 !== 0) || (gYear - 1) % 400 === 0
      : isLeap;

  const monthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, prevIsLeap ? 30 : 29, 30];
  let daysElapsed = Math.floor((date.getTime() - refStart.getTime()) / 86400000);
  let mIdx = 0;
  while (mIdx < 11 && daysElapsed >= monthLengths[mIdx]) {
    daysElapsed -= monthLengths[mIdx];
    mIdx += 1;
  }
  const bDay = daysElapsed + 1;
  const monthName = BENGALI_MONTHS[mIdx] || 'বৈশাখ';
  return {
    day: bDay,
    monthName,
    year: banglaYear,
    formattedBn: `${toBengaliDigits(bDay)} ${monthName}, ${toBengaliDigits(banglaYear)} বঙ্গাব্দ`,
  };
}
