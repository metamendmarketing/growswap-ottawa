'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  MapPin, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Shield, 
  CalendarDays, 
  Plus,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { OttawaMap } from '@/components/map/OttawaMap';
import { ListingCard } from '@/components/market/ListingCard';
import { MultiSwapGraph } from '@/components/swap/MultiSwapGraph';
import { AddHarvestModal } from '@/components/market/AddHarvestModal';
import { SEED_PRODUCTS } from '@/lib/data/seed-products';
import { OTTAWA_COMMUNITIES } from '@/lib/data/ottawa-geo';

export default function HomePage() {
  const { listings, currentUser, getSwapMatchesForCurrentUser } = useAppStore();
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState(false);

  const swapMatches = getSwapMatchesForCurrentUser();
  const signature3Way = swapMatches.find((s) => s.type === 'THREE_WAY') || swapMatches[0];

  const recentListings = listings.slice(0, 6);
  const rescueListings = listings.filter((l) => l.listing_type === 'RESCUE' || l.is_rescue).slice(0, 3);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section: "Ottawa is Growing" */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-forest-950 to-stone-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/80 border border-forest-700/80 text-forest-200 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OTTAWA HYPERLOCAL FOOD INTELLIGENCE</span>
            </div>

            <div className="text-xs text-stone-400 font-mono flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zone 5a • Mid-August Peak Season Data</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Ottawa is <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Growing.</span>
            </h1>
            <p className="text-lg sm:text-xl text-stone-300 font-normal leading-relaxed">
              Instead of 500 isolated backyards, GrowSwap connects Ottawa as one distributed urban farm. Discover real-time harvest supply, execute zero-cash multi-party barter swaps, and forecast next season’s garden.
            </p>
          </div>

          {/* Real-time Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">486+</div>
              <div className="text-xs text-stone-400 mt-1 font-mono uppercase tracking-wider">Active Growers</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">1,840 lb</div>
              <div className="text-xs text-stone-400 mt-1 font-mono uppercase tracking-wider">Available Today</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">6,120 lb</div>
              <div className="text-xs text-stone-400 mt-1 font-mono uppercase tracking-wider">Coming Aug–Sep</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">18 Loops</div>
              <div className="text-xs text-stone-400 mt-1 font-mono uppercase tracking-wider">3-Way Swaps Active</div>
            </div>
          </div>

          {/* Quick Action CTA Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsAddHarvestOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List Fresh Harvest</span>
            </button>
            <Link
              href="/map"
              className="px-6 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm border border-stone-700 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Ottawa Living Map</span>
            </Link>
            <Link
              href="/swap"
              className="px-6 py-3.5 rounded-xl bg-indigo-900/50 hover:bg-indigo-900/80 text-indigo-200 font-semibold text-sm border border-indigo-700/60 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <span>View SwapMatch Engine</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Living Map Experience Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-forest-700 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-forest-600" />
              <span>Interactive Geo Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">Living Ottawa Harvest Map</h2>
            <p className="text-sm text-stone-600 mt-0.5">
              Live clusters across 17 Ottawa wards with timeline slider and 250–500m privacy jitter.
            </p>
          </div>
          <Link
            href="/map"
            className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1 font-mono uppercase tracking-wider"
          >
            <span>Open Fullscreen Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Embedded Living Map component */}
        <OttawaMap heightClassName="h-[580px]" activeSwapMatch={signature3Way} />
      </section>

      {/* 3. Featured Multi-Party Swap (SwapMatch Showcase) */}
      {signature3Way && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 uppercase tracking-wider">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Deterministic Barter Graph</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Active 3-Way Swap Loop for Alex
              </h2>
              <p className="text-sm text-stone-600 mt-0.5">
                Our graph solver detected a zero-cash circular exchange matching 100% of grower want lists.
              </p>
            </div>
            <Link
              href="/swap"
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <span>Explore All Swap Cycles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <MultiSwapGraph swapMatch={signature3Way} />
        </section>
      )}

      {/* 4. Urgent Surplus Rescue Ticker (If Any) */}
      {rescueListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Surplus Rescue Mode Active
                  </h3>
                  <p className="text-xs text-stone-600">
                    High-perishable garden gluts (summer squash, backyard apples, extra starts) available for immediate free pickup.
                  </p>
                </div>
              </div>
              <Link
                href="/market?tab=rescue"
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 font-mono uppercase"
              >
                <span>View All Rescue ({rescueListings.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rescueListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Fresh Listings from the Ottawa Marketplace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-forest-700 uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5" />
              <span>Ottawa Produce Exchange</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Fresh Backyard Listings
            </h2>
            <p className="text-sm text-stone-600 mt-0.5">
              Organic veggies, heritage eggs, and fresh herbs harvested within the last 24 hours.
            </p>
          </div>
          <Link
            href="/market"
            className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1 font-mono uppercase tracking-wider"
          >
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* 6. Ottawa Produce Index Snapshot & 2027 Planning Insight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Produce Index Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-forest-600" />
                <h3 className="font-bold text-base text-stone-900">GrowSwap Value Index</h3>
              </div>
              <Link href="/ottawa" className="text-xs text-forest-700 font-bold hover:underline font-mono">
                Food Grid →
              </Link>
            </div>
            <p className="text-xs text-stone-600">
              Suggested local benchmark value adjusted for supply/demand in Zone 5a.
            </p>
            <div className="space-y-2.5">
              {SEED_PRODUCTS.slice(0, 4).map((p) => (
                <Link
                  key={p.slug}
                  href={`/ottawa/product/${p.slug}`}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-forest-50/70 border border-stone-200/80 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-forest-700">
                        {p.name_en}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Retail ref: ${p.base_price?.toFixed(2)}/{p.default_unit}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-emerald-700">
                      ${(p.base_price * 0.95).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-emerald-600">Suggested Val</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 2027 Season Planning Insight Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 to-forest-950 text-white border border-stone-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CalendarDays className="w-4 h-4" />
                <span>Next-Season Intelligence</span>
              </div>
              <h3 className="text-xl font-bold leading-snug">
                Optimize Your Garden for 2027
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Ottawa had a 230% zucchini glut this August while garlic and root crops faced high scarcity. Use our optimizer to balance your garden beds with neighborhood demand.
              </p>

              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-xs font-mono space-y-1.5">
                <div className="text-amber-400">⬇ Reduce: Summer Squash (-75%)</div>
                <div className="text-emerald-400">⬆ Expand: Hardneck Garlic & Potatoes (+200%)</div>
              </div>
            </div>

            <Link
              href="/plan"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-colors block"
            >
              Run Garden Bed Optimization →
            </Link>
          </div>
        </div>
      </section>

      {/* Add Harvest Modal */}
      <AddHarvestModal
        isOpen={isAddHarvestOpen}
        onClose={() => setIsAddHarvestOpen(false)}
      />
    </div>
  );
}
