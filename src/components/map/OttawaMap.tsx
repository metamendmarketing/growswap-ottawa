'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Sparkles, 
  MapPin, 
  RefreshCw, 
  Filter, 
  Clock, 
  Info, 
  Compass, 
  ShieldCheck, 
  Maximize2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Coordinates, Listing, Profile, SwapMatch } from '@/types';
import { OTTAWA_CENTER, OTTAWA_COMMUNITIES, OTTAWA_COMMUNITY_GARDENS } from '@/lib/data/ottawa-geo';
import { useAppStore } from '@/lib/data/store';

export type MapLayer = 
  | 'AVAILABLE_NOW' 
  | 'GROWING' 
  | 'COMING_SOON' 
  | 'WANTED' 
  | 'PLANS_2027' 
  | 'SUPPLY_GAPS' 
  | 'SURPLUS_RESCUE' 
  | 'SWAPS' 
  | 'COMMUNITY_GARDENS';

interface OttawaMapProps {
  initialLayer?: MapLayer;
  heightClassName?: string;
  showSidebar?: boolean;
  selectedListingId?: string;
  onSelectListing?: (listing: Listing) => void;
  activeSwapMatch?: SwapMatch | null;
}

export function OttawaMap({
  initialLayer = 'AVAILABLE_NOW',
  heightClassName = 'h-[650px]',
  showSidebar = true,
  selectedListingId,
  onSelectListing,
  activeSwapMatch,
}: OttawaMapProps) {
  const { listings, currentUser, getSwapMatchesForCurrentUser } = useAppStore();
  
  const [activeLayer, setActiveLayer] = useState<MapLayer>(initialLayer);
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [activeMonth, setActiveMonth] = useState<number>(8); // August
  const [selectedPin, setSelectedPin] = useState<Listing | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [hoveredGrower, setHoveredGrower] = useState<string | null>(null);

  const months = [
    { num: 4, name: 'Apr', label: 'Early Starts' },
    { num: 5, name: 'May', label: 'Transplanting' },
    { num: 6, name: 'Jun', label: 'Early Harvest' },
    { num: 7, name: 'Jul', label: 'Summer Peak' },
    { num: 8, name: 'Aug', label: 'High Harvest' },
    { num: 9, name: 'Sep', label: 'Fall Harvest' },
    { num: 10, name: 'Oct', label: 'Late Roots' },
    { num: 11, name: 'Nov', label: 'Cured Stores' },
  ];

  // Filter listings according to layer and month
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (activeLayer === 'SURPLUS_RESCUE') {
        return l.listing_type === 'RESCUE' || l.is_rescue;
      }
      if (activeLayer === 'SWAPS') {
        return l.accepts_swap;
      }
      if (activeLayer === 'COMING_SOON') {
        return l.status === 'UPCOMING';
      }
      if (activeLayer === 'AVAILABLE_NOW') {
        return l.status === 'AVAILABLE';
      }
      return true;
    });
  }, [listings, activeLayer]);

  const swapMatches = useMemo(() => getSwapMatchesForCurrentUser(), [getSwapMatchesForCurrentUser]);
  const displaySwap = activeSwapMatch || (activeLayer === 'SWAPS' ? swapMatches[0] : null);

  // SVG coordinate transformation for Ottawa bounding box
  // Ottawa bounds: lat 45.12 to 45.52, lng -76.10 to -75.35
  const mapBounds = {
    minLat: 45.12,
    maxLat: 45.52,
    minLng: -76.10,
    maxLng: -75.35,
  };

  const toSvgCoords = (coords: Coordinates) => {
    const x = ((coords.lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 1000;
    const y = ((mapBounds.maxLat - coords.lat) / (mapBounds.maxLat - mapBounds.minLat)) * 700;
    return { x, y };
  };

  const alexPos = toSvgCoords(currentUser.public_location || { lat: 45.3941, lng: -75.6865 });
  const radiusPixels = (radiusKm / 35) * 280;

  return (
    <div className={`relative flex flex-col md:flex-row w-full ${heightClassName} bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800`}>
      {/* Map Header Overlay Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        {/* Layer Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-700/80 shadow-lg text-xs">
          <button
            onClick={() => setActiveLayer('AVAILABLE_NOW')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeLayer === 'AVAILABLE_NOW' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            🟢 Available Now
          </button>
          <button
            onClick={() => setActiveLayer('SURPLUS_RESCUE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeLayer === 'SURPLUS_RESCUE' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            🚨 Surplus Rescue
          </button>
          <button
            onClick={() => setActiveLayer('SWAPS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeLayer === 'SWAPS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            🔄 Multi-Swaps
          </button>
          <button
            onClick={() => setActiveLayer('COMMUNITY_GARDENS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeLayer === 'COMMUNITY_GARDENS' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            🌱 Gardens
          </button>
          <button
            onClick={() => setActiveLayer('SUPPLY_GAPS')}
            className={`hidden sm:inline-block px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeLayer === 'SUPPLY_GAPS' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            📊 Supply Gaps
          </button>
        </div>

        {/* Radius Selector */}
        <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-700/80 text-xs font-mono text-stone-300">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Radius:</span>
          {[5, 10, 15, 25, 50].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                radiusKm === r ? 'bg-forest-600 text-white font-bold' : 'hover:text-white'
              }`}
            >
              {r}k
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 h-full w-full bg-[#161c18] overflow-hidden">
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-cover select-none"
          style={{ background: 'radial-gradient(circle at 60% 45%, #1d2b21 0%, #111813 100%)' }}
        >
          <defs>
            {/* Glow filters */}
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-swap" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradient for swap animated route */}
            <linearGradient id="swap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Ottawa Waterways (Ottawa River, Rideau River & Canal Paths) */}
          <path
            d="M 50,220 Q 250,200 450,240 T 750,180 T 950,120"
            fill="none"
            stroke="#1e3a45"
            strokeWidth="38"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 520,240 Q 560,350 580,480 T 600,680"
            fill="none"
            stroke="#1a343d"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Rideau Canal */}
          <path
            d="M 525,245 Q 515,310 500,380 T 460,520"
            fill="none"
            stroke="#21424e"
            strokeWidth="10"
            strokeDasharray="4 2"
            opacity="0.4"
          />

          {/* Radius Search Circle from Alex's Location */}
          <circle
            cx={alexPos.x}
            cy={alexPos.y}
            r={radiusPixels}
            fill="#10b981"
            fillOpacity="0.04"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            className="transition-all duration-500 ease-out"
          />

          {/* Ottawa Neighbourhood Zones & Labels */}
          {OTTAWA_COMMUNITIES.map((c) => {
            const pos = toSvgCoords(c.center);
            const isSelected = selectedCommunity === c.slug;
            return (
              <g
                key={c.slug}
                className="cursor-pointer group"
                onClick={() => setSelectedCommunity(c.slug === selectedCommunity ? null : c.slug)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 42 : 28}
                  fill={isSelected ? '#10b981' : '#1f3427'}
                  fillOpacity={isSelected ? 0.35 : 0.18}
                  stroke={isSelected ? '#34d399' : '#2d4d38'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-300"
                />
                <text
                  x={pos.x}
                  y={pos.y - 12}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="600"
                  letterSpacing="0.05em"
                  className="group-hover:fill-emerald-300 transition-colors pointer-events-none"
                >
                  {c.name_en.split(' ')[0]}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 3}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="8"
                  fontFamily="monospace"
                  className="pointer-events-none"
                >
                  {c.active_growers_count} growers
                </text>
              </g>
            );
          })}

          {/* Community Gardens Layer */}
          {activeLayer === 'COMMUNITY_GARDENS' &&
            OTTAWA_COMMUNITY_GARDENS.map((cg) => {
              const pos = toSvgCoords(cg.location);
              return (
                <g key={cg.id} className="cursor-pointer group">
                  <circle cx={pos.x} cy={pos.y} r="8" fill="#3b82f6" fillOpacity="0.8" stroke="#ffffff" strokeWidth="2" />
                  <text x={pos.x} y={pos.y - 10} textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold">
                    {cg.name_en.split(' ')[0]} CG
                  </text>
                </g>
              );
            })}

          {/* Listings Markers with Cluster Logic */}
          {activeLayer !== 'COMMUNITY_GARDENS' &&
            filteredListings.slice(0, 160).map((listing, i) => {
              const pos = toSvgCoords(listing.public_location);
              const isSelected = selectedListingId === listing.id || selectedPin?.id === listing.id;
              const isRescue = listing.listing_type === 'RESCUE' || listing.is_rescue;

              let fillColor = '#10b981'; // Emerald for available
              if (isRescue) fillColor = '#f97316'; // Orange for rescue
              else if (listing.listing_type === 'SWAP') fillColor = '#818cf8'; // Indigo for swap

              return (
                <g
                  key={listing.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => {
                    setSelectedPin(listing);
                    if (onSelectListing) onSelectListing(listing);
                  }}
                  onMouseEnter={() => setHoveredGrower(listing.seller?.display_name || null)}
                  onMouseLeave={() => setHoveredGrower(null)}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 10 : 5.5}
                    fill={fillColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={isSelected ? 'url(#glow-emerald)' : undefined}
                    className="hover:scale-150 transition-all origin-center"
                  />
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke={fillColor} strokeWidth="2" opacity="0.6" className="animate-ping" />
                  )}
                </g>
              );
            })}

          {/* Alex's Home Garden Pin (Center of Demo) */}
          <g className="cursor-pointer">
            <circle cx={alexPos.x} cy={alexPos.y} r="12" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx={alexPos.x} cy={alexPos.y} r="5" fill="#a7f3d0" />
            <text x={alexPos.x} y={alexPos.y + 24} textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="system-ui">
              ★ Alex&apos;s Garden
            </text>
          </g>

          {/* Guaranteed 3-Way Swap Animated Curved Trade Route */}
          {displaySwap && displaySwap.type === 'THREE_WAY' && (
            <g className="swap-network-overlay pointer-events-none">
              {(() => {
                const p0 = toSvgCoords(displaySwap.legs[0].from_profile.public_location); // Alex (Ottawa South)
                const p1 = toSvgCoords(displaySwap.legs[0].to_profile.public_location);   // David (Nepean)
                const p2 = toSvgCoords(displaySwap.legs[1].to_profile.public_location);   // Sarah (Glebe)

                // Quadratic Bézier curved path connecting 3 points
                const pathD = `
                  M ${p0.x} ${p0.y} 
                  Q ${(p0.x + p1.x) / 2 - 20} ${(p0.y + p1.y) / 2 + 30} ${p1.x} ${p1.y}
                  Q ${(p1.x + p2.x) / 2 + 20} ${(p1.y + p2.y) / 2 - 30} ${p2.x} ${p2.y}
                  Q ${(p2.x + p0.x) / 2 + 10} ${(p2.y + p0.y) / 2 - 10} ${p0.x} ${p0.y}
                `;

                return (
                  <>
                    <path
                      d={pathD}
                      fill="#6366f1"
                      fillOpacity="0.08"
                      stroke="url(#swap-gradient)"
                      strokeWidth="3.5"
                      strokeDasharray="8 4"
                      className="animate-pulse"
                      filter="url(#glow-swap)"
                    />

                    {/* Animated moving pulse dots along the swap trade */}
                    <circle cx={p1.x} cy={p1.y} r="8" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                    <text x={p1.x} y={p1.y - 12} textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="bold">
                      David (Nepean)
                    </text>

                    <circle cx={p2.x} cy={p2.y} r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text x={p2.x} y={p2.y - 12} textAnchor="middle" fill="#fcd34d" fontSize="9" fontWeight="bold">
                      Sarah (The Glebe)
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Month Time Machine Slider */}
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-auto z-20 bg-stone-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-700/80 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-stone-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>TIME MACHINE:</span>
              <span className="text-emerald-400 font-bold">{months.find((m) => m.num === activeMonth)?.label}</span>
            </div>
            <span className="text-[10px] text-stone-600 uppercase font-mono">Zone 5a Calendar</span>
          </div>

          <div className="flex items-center gap-1">
            {months.map((m) => (
              <button
                key={m.num}
                onClick={() => setActiveMonth(m.num)}
                className={`flex-1 px-2.5 py-1 text-xs rounded-lg font-mono font-medium transition-all cursor-pointer ${
                  activeMonth === m.num
                    ? 'bg-gradient-to-r from-emerald-500 to-forest-600 text-white font-bold shadow-md scale-105'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hovered grower badge tooltip */}
        {hoveredGrower && (
          <div className="absolute top-16 left-6 z-30 px-3 py-1.5 rounded-lg bg-stone-950/90 text-white text-xs border border-stone-700 pointer-events-none flex items-center gap-1.5 font-mono shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Grower: {hoveredGrower} (Privacy Offset 350m)</span>
          </div>
        )}
      </div>

      {/* Side Detail Panel / Drawer */}
      {showSidebar && (
        <div className="w-full md:w-80 bg-stone-900 border-t md:border-t-0 md:border-l border-stone-800 p-4 flex flex-col justify-between overflow-y-auto text-stone-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Ottawa Food Pulse</span>
              </h3>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                LIVE
              </span>
            </div>

            {selectedPin ? (
              <div className="space-y-3 bg-stone-800/80 p-3.5 rounded-xl border border-stone-700">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl">{selectedPin.product?.emoji || '🥬'}</span>
                    <h4 className="font-bold text-white text-sm mt-1">{selectedPin.title}</h4>
                    <p className="text-xs text-stone-400">{selectedPin.community_name || 'Ottawa'}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-1 bg-emerald-950 rounded-md">
                    {selectedPin.listing_type === 'RESCUE' ? 'FREE RESCUE' : `$${selectedPin.price?.toFixed(2)}/${selectedPin.unit}`}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">{selectedPin.description}</p>

                <div className="pt-2 border-t border-stone-700 flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>Grower: {selectedPin.seller?.display_name}</span>
                  <span className="text-emerald-400">★ {selectedPin.seller?.rating_average}</span>
                </div>

                <Link
                  href={`/market/${selectedPin.id}`}
                  className="block w-full py-2 text-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  View Full Listing & Request Swap →
                </Link>
              </div>
            ) : displaySwap ? (
              <div className="space-y-3 bg-stone-800/80 p-3.5 rounded-xl border border-indigo-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 uppercase font-mono">
                    3-Way Swap Loop
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                    {displaySwap.match_score}% MATCH
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-snug">{displaySwap.summary}</p>
                <div className="text-[11px] text-stone-400 font-mono space-y-1 bg-stone-900/60 p-2 rounded">
                  <div>• Route: {displaySwap.total_distance_km} km loop</div>
                  <div>• Value Variance: {displaySwap.value_variance_percent}% (Balanced)</div>
                  <div>• Cash Needed: $0.00</div>
                </div>
                <Link
                  href="/swap"
                  className="block w-full py-2 text-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Execute 3-Way Barter →
                </Link>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-stone-400">
                <p>Click any map marker to inspect fresh backyard listings, grower profiles, or multi-party trade routes.</p>
                <div className="p-2.5 rounded-lg bg-stone-800/60 border border-stone-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Active Growers:</span>
                    <span className="text-white font-bold">486</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Today:</span>
                    <span className="text-emerald-400 font-bold">1,840 lb</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coming (Aug-Sep):</span>
                    <span className="text-cyan-400 font-bold">6,120 lb</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active 3-Way Loops:</span>
                    <span className="text-indigo-400 font-bold">18 circular</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-800 text-[10px] text-stone-600 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ottawa PostGIS Coordinate Obfuscation Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
