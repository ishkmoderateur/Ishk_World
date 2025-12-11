"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation } from "lucide-react";
type LeafletModule = typeof import("leaflet");


const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface NewsLocation {
  id: number;
  title: string;
  region: string;
  lat: number;
  lng: number;
  count: number;
}

interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

export default function NewsMap({ 
  onRegionClick, 
  userLocation 
}: { 
  onRegionClick?: (region: string) => void;
  userLocation?: UserLocation | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [leaflet, setLeaflet] = useState<LeafletModule | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setLeaflet(mod as LeafletModule);
    });
    // Add custom CSS for zoom control positioning
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-control-zoom {
        position: absolute !important;
        bottom: 20px !important;
        right: 20px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const newsLocations: NewsLocation[] = [
    { id: 1, title: "Europe", region: "Europe", lat: 50, lng: 10, count: 12 },
    { id: 2, title: "North America", region: "North America", lat: 40, lng: -100, count: 8 },
    { id: 3, title: "Asia", region: "Asia", lat: 30, lng: 100, count: 15 },
    { id: 4, title: "Africa", region: "Africa", lat: 0, lng: 20, count: 6 },
    { id: 5, title: "South America", region: "South America", lat: -15, lng: -60, count: 5 },
    { id: 6, title: "Oceania", region: "Oceania", lat: -25, lng: 140, count: 3 },
  ];

  // Custom user location icon
  const userIcon = mounted && leaflet ? (leaflet as any).divIcon({
    html: '<div style="background: #87ceeb; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(135, 206, 235, 0.8);"></div>',
    className: 'custom-user-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }) : null;

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-navy/50 rounded-3xl flex items-center justify-center border border-sky/20">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-sky/40 mx-auto mb-4 animate-pulse" />
          <p className="text-sky/60">Loading map...</p>
        </div>
      </div>
    );
  }

  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : [20, 0];
  const mapZoom = userLocation ? 6 : 2.5;
  const mapKey = `map-${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`;

  return (
    <div className="w-full h-full">
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={mapZoom}
        minZoom={2}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap France & OpenStreetMap contributors'
        />
        
        {/* User Location Marker */}
        {userLocation && userIcon && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>
              <div className="text-center p-2">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Navigation className="w-4 h-4 text-sky" />
                  <h3 className="font-semibold text-navy">Your Location</h3>
                </div>
                {userLocation.city && (
                  <p className="text-sm text-gray-600">
                    {userLocation.city}, {userLocation.country}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* News Region Markers */}
        {newsLocations.map((location) => (
          <Marker key={location.id} position={[location.lat, location.lng]}>
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-semibold text-navy mb-1">{location.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{location.count} news briefs</p>
                <button
                  onClick={() => onRegionClick?.(location.region)}
                  className="text-xs bg-sky text-white px-3 py-1 rounded-full hover:bg-sky/90"
                >
                  View News
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
