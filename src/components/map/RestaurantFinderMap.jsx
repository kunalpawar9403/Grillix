import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Crosshair, 
  MapPin, 
  Star, 
  Navigation, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

export const RestaurantFinderMap = ({ 
  restaurants = [], 
  selectedRestaurant = null, 
  onSelectRestaurant = () => {},
  className = "w-full h-full"
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const currentTileLayerRef = useRef(null);

  const [activeCity, setActiveCity] = useState('All');
  const [mapStyle, setMapStyle] = useState('streets');

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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center initially on Moshi, Pune or selected restaurant
      const initialLat = selectedRestaurant?.lat || 18.6738;
      const initialLng = selectedRestaurant?.lng || 73.8485;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      const config = getTileConfig(mapStyle, mapboxToken);
      const tileLayer = L.tileLayer(config.url, config.options).addTo(map);
      currentTileLayerRef.current = tileLayer;

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers for Indian Restaurants
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    restaurants.forEach((restaurant) => {
      if (!restaurant.lat || !restaurant.lng) return;

      const isSelected = selectedRestaurant?.id === restaurant.id;

      const markerHtml = `
        <div class="cursor-pointer group flex flex-col items-center" style="transform: translate(-50%, -100%);">
          <!-- Store Label Pill -->
          <div style="background: ${isSelected ? '#244507' : '#315B0B'}; color: ${isSelected ? '#A8E83C' : '#ffffff'}; font-size: 11px; font-weight: 800; padding: 2px 10px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); white-space: nowrap; margin-bottom: 4px; border: 1.5px solid ${isSelected ? '#A8E83C' : 'rgba(255,255,255,0.4)'}; display: flex; items-center; gap: 4px;">
            <span>★ ${restaurant.rating}</span> • <span>${restaurant.shortName}</span>
          </div>

          <!-- Store Avatar Circle -->
          <div style="width: ${isSelected ? '44px' : '38px'}; height: ${isSelected ? '44px' : '38px'}; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 8px 20px rgba(36,69,7,0.45); overflow: hidden; background: #ffffff; ring: 3px ${isSelected ? '#A8E83C' : 'transparent'};">
            <img src="${restaurant.image}" alt="${restaurant.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <!-- Pin Pointer Needle -->
          <div style="width: 8px; height: 8px; background: ${isSelected ? '#244507' : '#315B0B'}; border-radius: 50%; margin-top: -3px;"></div>
        </div>
      `;

      const divIcon = L.divIcon({
        className: 'custom-restaurant-pin',
        html: markerHtml,
        iconSize: [0, 0]
      });

      const marker = L.marker([restaurant.lat, restaurant.lng], { 
        icon: divIcon,
        zIndexOffset: isSelected ? 1000 : 500 
      }).addTo(map);

      // Popup with rich information
      const popupContent = `
        <div style="font-family: inherit; width: 220px; padding: 4px 2px;">
          <div style="height: 100px; border-radius: 12px; overflow: hidden; margin-bottom: 8px;">
            <img src="${restaurant.image}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #244507; line-height: 1.2;">
            ${restaurant.name}
          </div>
          <div style="font-size: 11px; color: #747B68; margin-top: 2px;">
            📍 ${restaurant.address}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 11px; font-weight: bold; color: #315B0B;">
            <span>★ ${restaurant.rating} (${restaurant.reviewsCount})</span>
            <span>${restaurant.distance}</span>
          </div>
          <div style="font-size: 10px; color: #555; margin-top: 4px; background: #EEF4E3; padding: 3px 6px; border-radius: 6px;">
            🕒 ${restaurant.hours}
          </div>
        </div>
      `;

      // Delivery coverage zone circle
      if (restaurant.deliveryRadiusKm) {
        const radiusMeters = restaurant.deliveryRadiusKm * 1000;
        const circle = L.circle([restaurant.lat, restaurant.lng], {
          radius: radiusMeters,
          color: '#315B0B',
          weight: 2,
          opacity: 0.8,
          dashArray: '6, 6',
          fillColor: '#a8e83c',
          fillOpacity: 0.12
        }).addTo(map);
        circle.bindTooltip(`🛵 Delivery Coverage Zone (${restaurant.deliveryRadiusKm} km Radius)`, { sticky: true });
        markersRef.current[`circle-${restaurant.id}`] = circle;
      }

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectRestaurant(restaurant);
      });

      markersRef.current[restaurant.id] = marker;
    });

    // Auto-center on the restaurant
    if (restaurants.length > 0 && restaurants[0].lat && restaurants[0].lng) {
      map.setView([restaurants[0].lat, restaurants[0].lng], 13);
    }

  }, [restaurants, selectedRestaurant]);

  // Pan to selected restaurant smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedRestaurant?.lat || !selectedRestaurant?.lng) return;

    map.flyTo([selectedRestaurant.lat, selectedRestaurant.lng], 14, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    const marker = markersRef.current[selectedRestaurant.id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 800);
    }
  }, [selectedRestaurant]);

  // City Quick Jump
  const handleJumpToCity = (cityName) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setActiveCity(cityName);

    if (cityName === 'All') {
      const validPoints = restaurants
        .filter(r => r.lat && r.lng)
        .map(r => [r.lat, r.lng]);
      if (validPoints.length > 0) {
        map.fitBounds(L.latLngBounds(validPoints), { padding: [50, 50], animate: true });
      }
      return;
    }

    const matched = restaurants.find(r => 
      r.city?.toLowerCase().includes(cityName.toLowerCase()) || 
      r.name?.toLowerCase().includes(cityName.toLowerCase())
    );

    if (matched?.lat && matched?.lng) {
      onSelectRestaurant(matched);
      map.flyTo([matched.lat, matched.lng], 13, { duration: 1.2 });
    }
  };

  // Browser GPS Locate
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapInstanceRef.current;
        if (!map) return;

        map.flyTo([latitude, longitude], 14, { duration: 1.5 });

        // Add user location blue dot
        const userIcon = L.divIcon({
          className: 'user-gps-dot',
          html: `
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="position: absolute; inset: 0; border-radius: 50%; background: #38bdf8; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>
              <div style="position: relative; width: 20px; height: 20px; margin: 2px; border-radius: 50%; background: #0284c7; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          iconSize: [24, 24]
        });

        L.marker([latitude, longitude], { icon: userIcon }).addTo(map)
          .bindPopup('<b>Your Current Location</b>')
          .openPopup();
      },
      () => {
        // Fallback to Mumbai if denied
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([19.0657, 72.8687], 13);
        }
      }
    );
  };

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

  return (
    <div className={`relative ${className} overflow-hidden rounded-3xl bg-[#EEF4E3] border border-[#315B0B]/30 shadow-md`}>
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Bar: Moshi Kitchen & Coverage Information */}
      <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none flex items-center justify-between gap-2">
        {/* Left: Moshi Kitchen & Delivery Coverage Badge */}
        <div className="pointer-events-auto bg-[#244507]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#A8E83C]/30 flex items-center space-x-2.5 text-white">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8E83C] animate-ping absolute"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8E83C]"></span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#A8E83C]">
                Moshi Central Kitchen
              </span>
              <span className="text-[9px] bg-white/20 text-[#EEF4E3] px-2 py-0.5 rounded-full font-bold">
                8.5 km EV Radius
              </span>
            </div>
            <p className="text-[10px] font-semibold text-stone-200 hidden sm:block">
              Spine Road & PCMC Express Delivery Zone
            </p>
          </div>
        </div>

        {/* Right: Action Buttons (Recenter & Locate Me) */}
        <div className="pointer-events-auto flex items-center space-x-1.5">
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([18.6738, 73.8485], 14, { duration: 1.2 });
              }
            }}
            className="px-3 py-2 rounded-2xl bg-white/95 hover:bg-white text-[#244507] shadow-lg border border-[#D0D8C2] text-xs font-bold flex items-center space-x-1.5 transition-transform active:scale-95"
            title="Recenter Map on Moshi Kitchen"
          >
            <MapPin size={13} className="text-[#315B0B]" />
            <span className="hidden sm:inline">Moshi Kitchen</span>
          </button>

          <button
            onClick={handleLocateMe}
            className="px-3 py-2 rounded-2xl bg-[#315B0B] hover:bg-[#244507] text-white shadow-lg border border-[#315B0B] text-xs font-bold flex items-center space-x-1.5 transition-transform active:scale-95"
            title="Locate Nearest Distance to Moshi Kitchen"
          >
            <Crosshair size={13} className="text-[#A8E83C]" />
            <span>Locate Me</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Map Style Switcher */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-lg border border-[#D0D8C2] flex items-center space-x-1">
        <span className="text-[9px] font-black uppercase tracking-wider text-[#747B68] mr-1 hidden sm:inline">
          View:
        </span>
        {['streets', 'navigation', 'dark', 'satellite'].map((s) => (
          <button
            key={s}
            onClick={() => changeTiles(s)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize transition-colors ${
              mapStyle === s ? 'bg-[#244507] text-[#A8E83C]' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

    </div>
  );
};
