"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import NewsMap from "@/components/news-map";
import { TrendingUp, Trophy, Lightbulb, Search, X } from "lucide-react";

interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get user location on mount
  useEffect(() => {
    const detectIpLocation = async () => {
      try {
        // Try ipwho.is first (HTTPS, free)
        const r1 = await fetch("https://ipwho.is/?lang=fr");
        const d1 = await r1.json();
        if (d1 && typeof d1.latitude !== 'undefined' && typeof d1.longitude !== 'undefined') {
          const lat = Number(d1.latitude);
          const lng = Number(d1.longitude);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            setUserLocation({
              lat,
              lng,
              city: d1.city,
              country: d1.country,
            });
            return;
          }
        }
      } catch {}

      try {
        // Fallback to ipapi.co
        const r2 = await fetch("https://ipapi.co/json/?lang=fr");
        const d2 = await r2.json();
        if (d2 && typeof d2.latitude !== 'undefined' && typeof d2.longitude !== 'undefined') {
          const lat = Number(d2.latitude);
          const lng = Number(d2.longitude);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            setUserLocation({
              lat,
              lng,
              city: d2.city,
              country: d2.country_name,
            });
            return;
          }
        }
      } catch {}
      finally {
        setLocationLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`
            );
            const data = await response.json();
            setUserLocation({
              lat: latitude,
              lng: longitude,
              city: data.address?.city || data.address?.town || data.address?.village,
              country: data.address?.country,
            });
          } catch (error) {
            setUserLocation({ lat: latitude, lng: longitude });
          }
          setLocationLoading(false);
        },
        () => {
          detectIpLocation();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      detectIpLocation();
    }
  }, []);

  const categories = [
    { id: "politics", name: "Politique", icon: TrendingUp, color: "#0EA5E9" },
    { id: "sports", name: "Sports", icon: Trophy, color: "#22C55E" },
    { id: "business", name: "Économie", icon: Lightbulb, color: "#F59E0B" },
  ];

  const fetchNewsData = async (category?: string, query?: string, country?: string, onlyToday?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/news?language=fr';
      if (category) url += `&category=${category}`;
      if (query) url += `&q=${query}`;
      if (country) url += `&country=${country}`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        let results = Array.isArray(data.results) ? data.results : [];
        if (onlyToday) {
          const today = new Date();
          const y = today.getFullYear();
          const m = today.getMonth();
          const d = today.getDate();
          results = results.filter((article: any) => {
            try {
              const pub = new Date(article.pubDate);
              const isToday = pub.getFullYear() === y && pub.getMonth() === m && pub.getDate() === d;
              const countries: string[] = Array.isArray(article.country) ? article.country : [];
              const hasMorocco = countries.some((c) => (c || '').toLowerCase() === 'ma' || (c || '').toLowerCase() === 'morocco');
              const isSports = Array.isArray(article.category) ? article.category.includes('sports') : false;
              return isToday && hasMorocco && isSports;
            } catch {
              return false;
            }
          });
          if (results.length === 0) {
            try {
              const fallbackRes = await fetch('/api/news?language=fr&q=Maroc%20sports');
              const fallbackData = await fallbackRes.json();
              if (fallbackRes.ok) {
                const alt = Array.isArray(fallbackData.results) ? fallbackData.results : [];
                results = alt.filter((article: any) => {
                  try {
                    const pub = new Date(article.pubDate);
                    return pub.getFullYear() === y && pub.getMonth() === m && pub.getDate() === d;
                  } catch {
                    return false;
                  }
                });
              }
            } catch {}
          }
        }
        setNews(results);
      } else {
        setError(data?.error || 'Failed to fetch news');
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Unable to load news right now');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNewsData(undefined, searchQuery);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      const isSports = selectedCategory === 'sports';
      fetchNewsData(selectedCategory, undefined, isSports ? 'ma' : undefined, isSports);
    }
  }, [selectedCategory]);

  const onRegionClick = (region: string) => {
    const regionToCountry: Record<string, string> = {
      'North America': 'us',
      'Europe': 'gb',
      'Asia': 'in',
      'Africa': 'za',
      'South America': 'br',
      'Oceania': 'au',
      'Global': 'us',
    };
    const country = regionToCountry[region] || 'us';
    fetchNewsData(undefined, undefined, country);
  };

  return (
    <main className="min-h-screen relative bg-gradient-to-b from-cream via-white to-white">
      <Navbar />
      
      {/* Full Page Map with Overlay Card */}
      <div className="fixed left-0 right-0 bottom-0 top-20">
        {/* Map Background - Full Screen */}
        <div className="absolute inset-0">
          <NewsMap 
            onRegionClick={onRegionClick}
            userLocation={userLocation}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

        {/* Left Sidebar - Search & Categories */}
        <div className="relative z-10 flex h-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm border border-sage/20 shadow-xl p-4 md:w-96 w-[90vw] max-w-md rounded-2xl md:ml-6 ml-4 max-h-[56vh] overflow-y-auto self-start"
          >
            <h1 className="text-2xl font-heading font-bold text-charcoal mb-2">
              Explorer les actualités
            </h1>
            <p className="text-charcoal/60 text-sm mb-3">Recherchez par mots-clés ou parcourez les catégories.</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des actualités..."
                  className="w-full px-4 py-3 pr-20 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent text-charcoal placeholder:text-charcoal/50 bg-white"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-charcoal/50 hover:text-charcoal"
                      aria-label="Effacer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="text-sky hover:text-sky/80"
                    aria-label="Rechercher"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Category Selection */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-charcoal mb-3">Catégories</h2>
              <div className="grid grid-cols-1 gap-2">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-3 w-full p-3 rounded-xl border transition-all cursor-pointer bg-white"
                    style={{
                      borderColor: selectedCategory === category.id ? category.color : '#E5E7EB',
                      backgroundColor: selectedCategory === category.id ? `${category.color}15` : 'white',
                    }}
                  >
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${category.color}22` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: category.color }} />
                    </div>
                    <span className="font-medium text-charcoal text-sm">{category.name}</span>
                  </motion.button>
                );
              })}
            </div>

            </div>
          </motion.div>

          {/* News Deck */}
          <div className="absolute z-20 bottom-6 right-6 md:left-[26rem] left-4">
            {loading && (
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white mt-3">Loading news...</p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="inline-flex items-center bg-white/95 backdrop-blur-lg rounded-xl px-4 py-3 shadow">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && news.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h2 className="text-xl font-heading font-semibold text-white mb-3">À la une</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {news.slice(0, 6).map((article, index) => (
                    <motion.div
                      key={article.article_id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="bg-white/95 backdrop-blur-sm border border-sage/20 rounded-lg p-3 shadow-sm hover:shadow transition-all cursor-pointer"
                      onClick={() => window.open(article.source_url, '_blank')}
                    >
                      {article.image_url && (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-16 object-cover rounded-md mb-2"
                        />
                      )}
                      <h3 className="font-semibold text-charcoal mb-1 text-[13px] leading-tight line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-charcoal/70 text-[12px] leading-snug line-clamp-1 mb-2">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-charcoal/60">
                        <span className="font-medium truncate max-w-[60%]">{article.source_name}</span>
                        <span>{new Date(article.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {!loading && !error && news.length === 0 && (
              <div className="inline-flex items-center bg-white/95 backdrop-blur-sm border border-sage/20 rounded-xl px-4 py-3 shadow-sm">
                <p className="text-charcoal text-sm">Aucune actualité trouvée. Essayez une autre catégorie, région ou recherche.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
