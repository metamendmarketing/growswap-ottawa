'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Sprout, 
  Clock 
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { ListingCard } from '@/components/market/ListingCard';
import { AddHarvestModal } from '@/components/market/AddHarvestModal';
import { OTTAWA_COMMUNITIES } from '@/lib/data/ottawa-geo';

type MarketTab = 'ALL' | 'TODAY' | 'AVAILABLE' | 'SWAP' | 'FREE' | 'COMING_SOON' | 'RESCUE';

function MarketContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  const initialTabParam = searchParams.get('tab');

  const { listings } = useAppStore();
  const [activeTab, setActiveTab] = useState<MarketTab>(
    initialTabParam === 'rescue' ? 'RESCUE' : 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('ALL');
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState(initialAction === 'add-harvest');

  const tabs: { id: MarketTab; label: string; icon?: any; badgeColor?: string }[] = [
    { id: 'ALL', label: 'Everything' },
    { id: 'TODAY', label: 'Picked Today' },
    { id: 'AVAILABLE', label: 'Available Now' },
    { id: 'SWAP', label: 'Swap / Barter' },
    { id: 'RESCUE', label: 'Surplus Rescue 🚨' },
    { id: 'FREE', label: 'Free Giveaway' },
    { id: 'COMING_SOON', label: 'Coming Soon' },
  ];

  const categories = ['ALL', 'Vegetables', 'Herbs', 'Fruits', 'Eggs & Apiary', 'Seeds & Starts'];

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Tab filter
      if (activeTab === 'TODAY') {
        if (!listing.harvested_at) return false;
      } else if (activeTab === 'AVAILABLE') {
        if (listing.status !== 'AVAILABLE') return false;
      } else if (activeTab === 'SWAP') {
        if (!listing.accepts_swap && listing.listing_type !== 'SWAP') return false;
      } else if (activeTab === 'RESCUE') {
        if (listing.listing_type !== 'RESCUE' && !listing.is_rescue) return false;
      } else if (activeTab === 'FREE') {
        if (listing.listing_type !== 'FREE' && listing.listing_type !== 'RESCUE') return false;
      } else if (activeTab === 'COMING_SOON') {
        if (listing.status !== 'UPCOMING') return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && listing.product?.category !== selectedCategory) {
        return false;
      }

      // Community filter
      if (selectedCommunity !== 'ALL' && listing.community_name !== selectedCommunity) {
        return false;
      }

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = listing.title.toLowerCase().includes(q);
        const matchDesc = listing.description?.toLowerCase().includes(q);
        const matchProd = listing.product?.name_en.toLowerCase().includes(q);
        const matchSeller = listing.seller?.display_name.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchProd && !matchSeller) return false;
      }

      return true;
    });
  }, [listings, activeTab, selectedCategory, selectedCommunity, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Header & Add Harvest CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-forest-700 uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ottawa Hyperlocal Food Exchange</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-1">
            Backyard & Small-Farm Marketplace
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Buy, barter, or rescue fresh organic produce directly from growers in your ward.
          </p>
        </div>

        <button
          onClick={() => setIsAddHarvestOpen(true)}
          className="px-5 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your Harvest</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Roma tomatoes, garlic, honey, grower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-forest-600 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-forest-600 focus:outline-hidden"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Community dropdown */}
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-forest-600 focus:outline-hidden"
          >
            <option value="ALL">Ward: All Ottawa Hubs</option>
            {OTTAWA_COMMUNITIES.map((c) => (
              <option key={c.slug} value={c.name_en}>
                {c.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Listings */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <span className="text-xs font-mono text-stone-500 uppercase">
            Showing {filteredListings.length} results
          </span>
          <span className="text-xs font-mono text-stone-500">
            Current Demo Date: 2026-08-24
          </span>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-stone-100/60 rounded-3xl border border-dashed border-stone-300">
            <Sprout className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">No matching harvests found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your search terms, changing the category, or expanding your radius.
            </p>
          </div>
        )}
      </div>

      {/* Add Harvest Modal */}
      <AddHarvestModal
        isOpen={isAddHarvestOpen}
        onClose={() => setIsAddHarvestOpen(false)}
      />
    </div>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-stone-400">Loading Ottawa Marketplace...</div>}>
      <MarketContent />
    </Suspense>
  );
}
