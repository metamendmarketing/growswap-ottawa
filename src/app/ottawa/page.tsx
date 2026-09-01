'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutGrid, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  AlertTriangle, 
  HeartHandshake, 
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin
} from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/data/seed-products';
import { OTTAWA_COMMUNITIES } from '@/lib/data/ottawa-geo';
import { formatCurrency } from '@/lib/utils';

export default function OttawaFoodGridPage() {
  const shortages = [
    { name: 'Ontario Music Garlic', category: 'Vegetables', supplyIndex: 0.42, demandIndex: 1.68, status: 'High Shortage', slug: 'music-garlic', emoji: '🧄' },
    { name: 'Pasture Farm Eggs', category: 'Eggs & Apiary', supplyIndex: 0.58, demandIndex: 1.45, status: 'Shortage', slug: 'pasture-raised-eggs', emoji: '🥚' },
    { name: 'Yukon Gold Potatoes', category: 'Vegetables', supplyIndex: 0.65, demandIndex: 1.35, status: 'Moderate Shortage', slug: 'yukon-gold-potatoes', emoji: '🥔' },
    { name: 'Raw Wildflower Honey', category: 'Eggs & Apiary', supplyIndex: 0.50, demandIndex: 1.25, status: 'Moderate Shortage', slug: 'wildflower-raw-honey', emoji: '🍯' },
  ];

  const surpluses = [
    { name: 'Green Zucchini', category: 'Vegetables', supplyIndex: 2.30, demandIndex: 0.45, status: 'High Glut (Surplus Rescue)', slug: 'zucchini', emoji: '🥒' },
    { name: 'Honeycrisp Apples', category: 'Fruits', supplyIndex: 1.85, demandIndex: 0.80, status: 'Glut (Rescue Needed)', slug: 'honeycrisp-apples', emoji: '🍎' },
    { name: 'Genovese Basil', category: 'Herbs', supplyIndex: 1.40, demandIndex: 0.90, status: 'Moderate Surplus', slug: 'genovese-basil', emoji: '🌿' },
    { name: 'Marketmore Cucumbers', category: 'Vegetables', supplyIndex: 1.35, demandIndex: 0.95, status: 'Moderate Surplus', slug: 'cucumber', emoji: '🥒' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-forest-700 uppercase tracking-wider">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Macro Food Security Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-1">
            Ottawa Food Grid & Intelligence
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Citywide supply/demand telemetry across 17 wards and 500+ participating backyards.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-forest-900 text-forest-200 border border-forest-800">
            Peak Harvest Window: Aug 15 – Sep 15
          </span>
        </div>
      </div>

      {/* 4 Citywide Macro Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-mono uppercase text-stone-500">Tracked Backyard Acreage</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-stone-900">14.2 acres</div>
          <p className="text-[11px] text-stone-400">Equivalent to 4 commercial farms</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-mono uppercase text-stone-500">Total Produce Exchanged</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">8,420 lb</div>
          <p className="text-[11px] text-stone-400">Since May 2026</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-mono uppercase text-stone-500">Surplus Food Rescued</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600">1,940 lb</div>
          <p className="text-[11px] text-amber-700 font-medium">Diverted from green bin waste</p>
        </div>

        <div className="p-5 rounded-2xl bg-forest-950 text-white border border-forest-800 shadow-md space-y-1">
          <div className="text-xs font-mono uppercase text-forest-300">Local Economic Retained Value</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">$27,450 CAD</div>
          <p className="text-[11px] text-forest-300">Direct household barter & savings</p>
        </div>
      </div>

      {/* Supply & Demand Shortage / Surplus Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Shortages (High Demand / Scarce) */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-base text-stone-900">High Scarcity Crops (Supply Gaps)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              High Barter Power
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Items wanted by many Ottawa households with low current backyard supply.
          </p>

          <div className="space-y-3">
            {shortages.map((item) => (
              <Link
                key={item.slug}
                href={`/ottawa/product/${item.slug}`}
                className="p-3.5 rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-200/80 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 group-hover:text-rose-700">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono text-stone-500">
                      Demand: {(item.demandIndex * 100).toFixed(0)}% • Supply: {(item.supplyIndex * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono text-xs font-bold text-rose-700">
                  {item.status} →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Surpluses (Abundant / Rescue Needed) */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base text-stone-900">Surplus Gluts (Rescue Candidates)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Immediate Distribution
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Crops with massive late-summer abundance needing quick preserving or community donation.
          </p>

          <div className="space-y-3">
            {surpluses.map((item) => (
              <Link
                key={item.slug}
                href={`/ottawa/product/${item.slug}`}
                className="p-3.5 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 group-hover:text-amber-800">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono text-stone-500">
                      Supply: {(item.supplyIndex * 100).toFixed(0)}% • Demand: {(item.demandIndex * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono text-xs font-bold text-amber-700">
                  {item.status} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-by-Ward Community Density Grid */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-forest-600" />
            <h3 className="font-bold text-base text-stone-900">Ottawa Ward Density Index</h3>
          </div>
          <span className="text-xs font-mono text-stone-500">17 Ottawa Hubs Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {OTTAWA_COMMUNITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/community/${c.slug}`}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-forest-50/80 border border-stone-200/80 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 group-hover:text-forest-700">
                  {c.name_en.split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                  {c.type}
                </span>
              </div>
              <div className="text-[11px] font-mono text-stone-500 mt-2 space-y-0.5">
                <div>{c.active_growers_count} growers active</div>
                <div>{c.total_listings_count} listings</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
