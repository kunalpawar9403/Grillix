import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { playDeliveredSound, playStatusUpdateSound } from '../../utils/soundEffects';

// Realistic Waypoints in Moshi & PCMC Corridor, Pune, India
const DELIVERY_ROUTE_WAYPOINTS = [
  [18.6738, 73.8485], // 1. GRILLIX Restaurant & Central Kitchen (Grand Spine Avenue, Moshi, Pune)
  [18.6698, 73.8445], // 2. Moshi Toll Plaza & Spine Flyover
  [18.6632, 73.8398], // 3. Sector 4, Spine Road
  [18.6565, 73.8342], // 4. Telco Road Junction, Bhosari MIDC
  [18.6495, 73.8285], // 5. Pune-Nashik Highway Link
  [18.6432, 73.8212], // 6. Kasarwadi - Pimpri Express Link
  [18.6365, 73.8130]  // 7. Customer Doorstep (Green Meadows Residency, Spine Road, Moshi, Pune)
];

const STORE_COORDS = DELIVERY_ROUTE_WAYPOINTS[0];
const DEST_COORDS = DELIVERY_ROUTE_WAYPOINTS[DELIVERY_ROUTE_WAYPOINTS.length - 1];

// Calculate approximate distance along route
const calculateTotalDistanceKm = (coords) => {
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const lat1 = coords[i][0];
    const lon1 = coords[i][1];
    const lat2 = coords[i + 1][0];
    const lon2 = coords[i + 1][1];
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += 6371 * c; // Earth radius in km
  }
  return total;
};

const TOTAL_ROUTE_DISTANCE = calculateTotalDistanceKm(DELIVERY_ROUTE_WAYPOINTS);

export const LiveDeliveryMap = ({ 
  orderStatus = 'Delivering',
  onOrderDelivered,
  customerAddress = 'Flat 502, Green Meadows Residency, Spine Road, Moshi, Pune 412105',
  restaurantName = 'GRILLIX Restaurant & Kitchen — Moshi, Pune',
  riderName = 'Vikram Singh'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const traversedPolylineRef = useRef(null);
  const currentTileLayerRef = useRef(null);

  // Mapbox Token State (read from localStorage or VITE_MAPBOX_TOKEN)
  const [mapboxToken, setMapboxToken] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_mapbox_token');
      if (saved && saved.trim()) return saved.trim();
    } catch {}
    return (import.meta.env.VITE_MAPBOX_TOKEN || '').trim();
  });

  // Rider progress along route: 0.0 to 1.0
  const [progress, setProgress] = useState(orderStatus === 'Delivered' ? 1 : 0.35);
  const [isPlaying, setIsPlaying] = useState(orderStatus === 'Delivering');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mapStyle, setMapStyle] = useState('streets'); // 'streets' | 'navigation' | 'dark' | 'satellite'

  // Calculated distance & ETA
  const remainingFraction = Math.max(0, 1 - progress);
  const remainingDistanceKm = (TOTAL_ROUTE_DISTANCE * remainingFraction).toFixed(2);
  const remainingMinutes = Math.max(1, Math.round(remainingFraction * 14));

  // Determine Tile Config based on Mapbox Token presence
  const getTileConfig = (style, token) => {
    if (token && token.startsWith('pk.')) {
      let styleId = 'streets-v12';
      if (style === 'dark') styleId = 'dark-v11';
      else if (style === 'navigation') styleId = 'navigation-day-v1';
      else if (style === 'satellite') styleId = 'satellite-streets-v12';

      return {
        isMapbox: true,
        url: `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`,
        options: {
          tileSize: 512,
          zoomOffset: -1,
          maxZoom: 19,
          attribution: '© Mapbox © OpenStreetMap'
        }
      };
    }

    // Default Fallback (CartoDB Voyager / OpenStreetMap: 100% Free, zero tokens)
    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (style === 'streets') {
      url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else if (style === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    return {
      isMapbox: false,
      url,
      options: {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '© OpenStreetMap © CARTO'
      }
    };
  };

  // Interpolate lat/lon from progress (0 to 1)
  const getInterpolatedPosition = (p) => {
    const clamped = Math.min(Math.max(p, 0), 1);
    const totalSegments = DELIVERY_ROUTE_WAYPOINTS.length - 1;
    const scaled = clamped * totalSegments;
    const index = Math.min(Math.floor(scaled), totalSegments - 1);
    const subProgress = scaled - index;

    const start = DELIVERY_ROUTE_WAYPOINTS[index];
    const end = DELIVERY_ROUTE_WAYPOINTS[index + 1];

    const lat = start[0] + (end[0] - start[0]) * subProgress;
    const lng = start[1] + (end[1] - start[1]) * subProgress;

    const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * (180 / Math.PI);
    return { pos: [lat, lng], angle, currentIndex: index, subProgress };
  };

  // Setup Leaflet map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialPos = getInterpolatedPosition(progress).pos;

      const map = L.map(mapContainerRef.current, {
        center: initialPos,
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Load initial tiles
      const config = getTileConfig(mapStyle, mapboxToken);
      const tileLayer = L.tileLayer(config.url, config.options).addTo(map);
      currentTileLayerRef.current = tileLayer;

      // Custom Zoom Control (bottom-right)
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // 1. Full Planned Route Polyline
      const fullRoute = L.polyline(DELIVERY_ROUTE_WAYPOINTS, {
        color: '#76A035',
        weight: 6,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '8, 8'
      }).addTo(map);
      polylineRef.current = fullRoute;

      // 2. Traversed Route Polyline
      const traversed = L.polyline([DELIVERY_ROUTE_WAYPOINTS[0]], {
        color: '#244507',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      traversedPolylineRef.current = traversed;

      // 3. Store Icon Marker
      const storeDivIcon = L.divIcon({
        className: 'custom-leaflet-marker store-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #244507; color: #A8E83C; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 4px; border: 1px solid rgba(255,255,255,0.3);">
              🏪 GRILLIX Kitchen
            </div>
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #315B0B; border: 3px solid #ffffff; box-shadow: 0 6px 16px rgba(36,69,7,0.4); display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div style="width: 8px; height: 8px; background: #244507; border-radius: 50%; margin-top: -3px;"></div>
          </div>
        `,
        iconSize: [0, 0]
      });

      L.marker(STORE_COORDS, { icon: storeDivIcon }).addTo(map)
        .bindPopup(`<b>${restaurantName}</b><br/>Order Prepared & Packed`);

      // 4. Destination Marker (Customer Doorstep)
      const destDivIcon = L.divIcon({
        className: 'custom-leaflet-marker dest-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #315B0B; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 4px; border: 1px solid rgba(255,255,255,0.3);">
              📍 Delivery Point
            </div>
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #A8E83C; border: 3px solid #244507; box-shadow: 0 6px 16px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: #244507;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div style="width: 8px; height: 8px; background: #315B0B; border-radius: 50%; margin-top: -3px;"></div>
          </div>
        `,
        iconSize: [0, 0]
      });

      L.marker(DEST_COORDS, { icon: destDivIcon }).addTo(map)
        .bindPopup(`<b>Your Address</b><br/>${customerAddress}`);

      // 5. Rider Live Marker with Radar Wave
      const riderDivIcon = L.divIcon({
        className: 'custom-leaflet-marker rider-marker',
        html: `
          <div id="leaflet-rider-wrapper" style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="position: absolute; width: 56px; height: 56px; border-radius: 50%; background: rgba(168, 232, 60, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            
            <div style="position: relative; z-index: 10; width: 44px; height: 44px; border-radius: 50%; background: #244507; border: 3px solid #A8E83C; box-shadow: 0 8px 24px rgba(36,69,7,0.5); display: flex; align-items: center; justify-content: center; color: #A8E83C;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18.5" cy="17.5" r="3.5"></circle>
                <circle cx="5.5" cy="17.5" r="3.5"></circle>
                <circle cx="15" cy="5" r="1"></circle>
                <path d="M12 17.5V14l-3-3 4-3 2 3h2"></path>
              </svg>
            </div>

            <div style="margin-top: 2px; background: #244507; color: #ffffff; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 6px; white-space: nowrap; border: 1px solid rgba(168,232,60,0.5);">
              🛵 ${riderName}
            </div>
          </div>
        `,
        iconSize: [0, 0]
      });

      const riderMarker = L.marker(initialPos, { icon: riderDivIcon, zIndexOffset: 1000 }).addTo(map);
      riderMarkerRef.current = riderMarker;

      const bounds = L.latLngBounds(DELIVERY_ROUTE_WAYPOINTS);
      map.fitBounds(bounds, { padding: [50, 50] });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [customerAddress, restaurantName, riderName]);

  // Keep callback ref updated
  const onOrderDeliveredRef = useRef(onOrderDelivered);
  useEffect(() => {
    onOrderDeliveredRef.current = onOrderDelivered;
  }, [onOrderDelivered]);

  // Update rider position, traversed polyline, and check delivery completion
  useEffect(() => {
    if (!mapInstanceRef.current || !riderMarkerRef.current) return;

    const { pos, currentIndex } = getInterpolatedPosition(progress);
    riderMarkerRef.current.setLatLng(pos);

    if (traversedPolylineRef.current) {
      const traversedCoords = DELIVERY_ROUTE_WAYPOINTS.slice(0, currentIndex + 1);
      traversedCoords.push(pos);
      traversedPolylineRef.current.setLatLngs(traversedCoords);
    }

    if (progress >= 1.0) {
      setIsPlaying(false);
      playDeliveredSound();
      if (onOrderDeliveredRef.current) {
        onOrderDeliveredRef.current();
      }
    }
  }, [progress]);

  // Simulation Animation Loop
  useEffect(() => {
    let animationTimer;
    if (isPlaying && progress < 1.0) {
      animationTimer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 0.015;
          if (next >= 1.0) {
            clearInterval(animationTimer);
            return 1.0;
          }
          return next;
        });
      }, 700);
    }
    return () => clearInterval(animationTimer);
  }, [isPlaying, progress]);

  // Auto-play when status switches to 'Delivering'
  useEffect(() => {
    if (orderStatus === 'Delivering') {
      setProgress((p) => {
        if (p < 1.0) {
          setIsPlaying(true);
          playStatusUpdateSound();
        }
        return p;
      });
    } else if (orderStatus === 'Delivered') {
      setProgress(1.0);
      setIsPlaying(false);
    }
  }, [orderStatus]);

  // Recenter helper
  const handleRecenter = (target) => {
    if (!mapInstanceRef.current) return;
    if (target === 'rider') {
      const { pos } = getInterpolatedPosition(progress);
      mapInstanceRef.current.panTo(pos, { animate: true });
    } else if (target === 'dest') {
      mapInstanceRef.current.panTo(DEST_COORDS, { animate: true });
    } else {
      const bounds = L.latLngBounds(DELIVERY_ROUTE_WAYPOINTS);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  };

  // Change Map Tile Styles
  const changeMapTiles = (style, tokenOverride) => {
    if (!mapInstanceRef.current) return;
    setMapStyle(style);

    const activeToken = tokenOverride !== undefined ? tokenOverride : mapboxToken;
    const config = getTileConfig(style, activeToken);

    // Remove existing tile layer
    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const newLayer = L.tileLayer(config.url, config.options).addTo(mapInstanceRef.current);
    currentTileLayerRef.current = newLayer;
    newLayer.bringToBack();
    mapInstanceRef.current.invalidateSize();
  };

  const hasActiveMapbox = mapboxToken && mapboxToken.startsWith('pk.');

  return (
    <div className={`relative transition-all duration-300 ${
      isFullScreen 
        ? 'fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center' 
        : 'w-full'
    }`}>
      <div className={`relative w-full overflow-hidden rounded-3xl border border-[#315B0B]/30 shadow-md ${
        isFullScreen ? 'h-[90vh] max-w-5xl bg-white' : 'h-80 sm:h-96'
      }`}>
        
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Live Top Floating Status Pill */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-[#244507]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-lg border border-[#A8E83C]/30 flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8E83C] animate-ping absolute"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8E83C]"></span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A8E83C] block leading-none">
                {progress >= 1.0 ? 'Delivered' : 'Live EV Tracking'}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-white leading-tight mt-0.5 block">
                {progress >= 1.0 
                  ? 'Arrived at your doorstep' 
                  : `${remainingMinutes} mins away • ${remainingDistanceKm} km`}
              </span>
            </div>
          </div>

          {/* Map Utility Controls */}
          <div className="pointer-events-auto flex items-center space-x-1.5">
            <button
              onClick={() => handleRecenter('rider')}
              className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-[#244507] shadow-lg flex items-center justify-center border border-[#D0D8C2] transition-transform active:scale-90"
              title="Locate Rider"
            >
              <Compass size={18} />
            </button>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-[#244507] shadow-lg flex items-center justify-center border border-[#D0D8C2] transition-transform active:scale-90"
              title={isFullScreen ? "Close Full Screen" : "Expand Map"}
            >
              {isFullScreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
          </div>
        </div>

        {/* Floating Simulation Control Bar (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-[#D0D8C2] flex items-center space-x-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={progress >= 1.0}
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-[#315B0B] text-white shadow-xs'
                : 'bg-[#EEF4E3] text-[#244507] hover:bg-[#D5E1C3]'
            }`}
            title={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
          </button>

          <button
            onClick={() => setProgress((p) => Math.min(1.0, p + 0.2))}
            disabled={progress >= 1.0}
            className="w-7 h-7 rounded-xl bg-[#EEF4E3] hover:bg-[#D5E1C3] text-[#244507] flex items-center justify-center transition-all active:scale-95"
            title="Forward Route"
          >
            <FastForward size={12} />
          </button>

          <button
            onClick={() => {
              setProgress(0);
              setIsPlaying(true);
            }}
            className="w-7 h-7 rounded-xl bg-[#EEF4E3] hover:bg-[#D5E1C3] text-[#244507] flex items-center justify-center transition-all active:scale-95"
            title="Reset Route"
          >
            <RotateCcw size={12} />
          </button>

          <div className="h-3.5 w-px bg-stone-300 mx-1"></div>

          {/* Clean Style Switcher */}
          <div className="flex items-center space-x-1">
            {[
              { id: 'streets', label: 'Day' },
              { id: 'dark', label: 'Dark' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => changeMapTiles(t.id)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                  mapStyle === t.id ? 'bg-[#244507] text-[#A8E83C]' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress percent bar on map bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#EEF4E3]/70 z-10">
          <div 
            className="h-full bg-[#A8E83C] transition-all duration-300 ease-linear shadow-xs"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

      </div>

    </div>
  );
};
