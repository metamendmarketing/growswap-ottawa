'use client';

import React, { useState } from 'react';
import { OttawaMap, MapLayer } from '@/components/map/OttawaMap';
import { ListingCard } from '@/components/market/ListingCard';
import { useAppStore } from '@/lib/data/store';
import { Listing } from '@/types';
import { Filter, Layers, MapPin, Search, Sparkles } from 'lucide-react';

export default function MapPage() {
  const { listings } = useAppStore();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState<MapLayer>('AVAILABLE_NOW');
  const [viewMode, setViewMode] = useState<'MAP_SPLIT' | 'MAP_FULL'>('MAP_SPLIT');

  const filteredListings = listings.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.product?.name_en.toLowerCase().includes(q) ||
      l.community_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 flex flex-col">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-forest-700 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ottawa Hyperlocal Geo Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Living Harvest Map
          </h1>
          <p className="text-xs text-stone-600">
            Obfuscated 250–500m privacy grids across 17 Ottawa communities.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crop, grower, ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-forest-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-mono">
            <button
              onClick={() => setViewMode('MAP_SPLIT')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'MAP_SPLIT' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('MAP_FULL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'MAP_FULL' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Map Only
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map */}
      <div className="flex-1 min-h-[600px]">
        <OttawaMap
          heightClassName={viewMode === 'MAP_FULL' ? 'h-[750px]' : 'h-[620px]'}
          selectedListingId={selectedListing?.id}
          onSelectListing={(l) => setSelectedListing(l)}
        />
      </div>

      {/* Split List View (If Split View is active) */}
      {viewMode === 'MAP_SPLIT' && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-forest-600" />
              <span>Visible Ottawa Harvests ({filteredListings.length})</span>
            </h3>
            <span className="text-xs text-stone-500 font-mono">Sorted by Proximity to Old Ottawa South</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.slice(0, 9).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
