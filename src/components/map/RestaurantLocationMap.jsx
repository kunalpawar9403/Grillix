import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  ExternalLink, 
  Compass, 
  Layers, 
  MapPin, 
  Maximize2,
  CheckCircle2
} from 'lucide-react';

export const RestaurantLocationMap = ({ 
  restaurant, 
  className = "w-full h-72 sm:h-80" 
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentTileLayerRef = useRef(null);
  const markerRef = useRef(null);
  const radiusCircleRef = useRef(null);

  const [mapStyle, setMapStyle] = useState('streets');
  const [distanceInfo, setDistanceInfo] = useState(restaurant?.distance || '1.2 km');

  // Mapbox token
  const mapboxToken = (() => {
    try {
      const saved = localStorage.getItem('grillix_mapbox_token');
      if (saved && saved.trim()) return saved.trim();
    } catch {}
    return (import.meta.env.VITE_MAPBOX_TOKEN || '').trim();
  })();

  const getTileConfig = (style, token) => {
    if (token && token.startsWith('pk.')) {
      let styleId = 'streets-v12';
      if (style === 'dark') styleId = 'dark-v11';
      else if (style === 'navigation') styleId = 'navigation-day-v1';
      else if (style === 'satellite') styleId = 'satellite-streets-v12';

      return {
        url: `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`,
        options: {
          tileSize: 512,
          zoomOffset: -1,
          maxZoom: 19,
          attribution: '© Mapbox © OpenStreetMap'
        }
      };
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (style === 'streets') {
      url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else if (style === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    return {
      url,
      options: {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '© OpenStreetMap © CARTO'
      }
    };
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const lat = restaurant?.lat || 19.0657;
    const lng = restaurant?.lng || 72.8687;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      const config = getTileConfig(mapStyle, mapboxToken);
      const tileLayer = L.tileLayer(config.url, config.options).addTo(map);
      currentTileLayerRef.current = tileLayer;

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.setView([lat, lng], 14);

    // Update marker
    if (markerRef.current) markerRef.current.remove();
    if (radiusCircleRef.current) radiusCircleRef.current.remove();

    // 5km Express Delivery Zone Circle
    radiusCircleRef.current = L.circle([lat, lng], {
      color: '#315B0B',
      fillColor: '#A8E83C',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '4, 8',
      radius: 3500 // 3.5 km delivery radius
    }).addTo(map);

    // Custom Marker
    const markerHtml = `
      <div class="cursor-pointer group flex flex-col items-center" style="transform: translate(-50%, -100%);">
        <div style="background: #244507; color: #A8E83C; font-size: 11px; font-weight: 800; padding: 3px 12px; border-radius: 9999px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); white-space: nowrap; margin-bottom: 4px; border: 2px solid #A8E83C; display: flex; align-items: center; gap: 4px;">
          <span>🇮🇳 ${restaurant?.name || 'GRILLIX Kitchen'}</span>
        </div>
        <div style="width: 44px; height: 44px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 8px 24px rgba(36,69,7,0.5); overflow: hidden; background: #ffffff;">
          <img src="${restaurant?.image || '/images/restaurant-interior-1.jpg'}" alt="${restaurant?.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="width: 10px; height: 10px; background: #244507; border-radius: 50%; margin-top: -4px;"></div>
      </div>
    `;

    const icon = L.divIcon({
      className: 'restaurant-detail-pin',
      html: markerHtml,
      iconSize: [0, 0]
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: inherit; width: 200px; padding: 2px;">
        <b style="color: #244507; font-size: 13px;">${restaurant?.name}</b>
        <p style="font-size: 11px; color: #666; margin: 4px 0;">${restaurant?.address}</p>
        <div style="font-size: 11px; font-weight: bold; color: #315B0B;">3.5 km Express Delivery Zone</div>
      </div>
    `);
    markerRef.current = marker;

    return () => {
      // Cleanup on unmount
    };
  }, [restaurant]);

  const changeTiles = (style) => {
    if (!mapInstanceRef.current) return;
    setMapStyle(style);
    const config = getTileConfig(style, mapboxToken);

    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const newLayer = L.tileLayer(config.url, config.options).addTo(mapInstanceRef.current);
    currentTileLayerRef.current = newLayer;
    newLayer.bringToBack();
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current || !restaurant?.lat || !restaurant?.lng) return;
    mapInstanceRef.current.flyTo([restaurant.lat, restaurant.lng], 15, { duration: 1 });
  };

  const googleMapsDirectionsUrl = restaurant?.lat && restaurant?.lng 
    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant?.address || 'Mumbai')}`;

  return (
    <div className={`relative ${className} rounded-2xl overflow-hidden border border-[#D0D8C2] shadow-sm bg-[#EEF4E3]`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Info Pill at Top */}
      <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none flex items-center justify-between">
        <div className="pointer-events-auto bg-[#244507]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#A8E83C]/30 text-white text-xs font-bold flex items-center space-x-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#A8E83C] animate-pulse"></span>
          <span>Live GPS Coordinates: {restaurant?.lat?.toFixed(4)}, {restaurant?.lng?.toFixed(4)}</span>
        </div>

        <button
          onClick={handleRecenter}
          className="pointer-events-auto w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#244507] flex items-center justify-center shadow-md border border-[#D0D8C2] active:scale-95 transition-transform"
          title="Recenter Map"
        >
          <Compass size={16} className="text-[#315B0B]" />
        </button>
      </div>

      {/* Floating Directions & Layers Bar at Bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Style pills */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl shadow-md border border-[#D0D8C2] flex items-center space-x-1 text-[10px] font-bold">
          {['streets', 'navigation', 'satellite'].map((s) => (
            <button
              key={s}
              onClick={() => changeTiles(s)}
              className={`px-2 py-0.5 rounded-md capitalize transition-colors ${
                mapStyle === s ? 'bg-[#244507] text-[#A8E83C]' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Directions button opening Google Maps */}
        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
        >
          <Navigation size={13} />
          <span>Turn-by-Turn GPS</span>
          <ExternalLink size={11} className="opacity-75" />
        </a>
      </div>
    </div>
  );
};
