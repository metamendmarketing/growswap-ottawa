'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Calendar, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { BedVisualizer } from '@/components/garden/BedVisualizer';
import { calculateGardenForecast } from '@/lib/garden-forecaster';
import { formatCurrency, formatQuantity } from '@/lib/utils';
import { Planting } from '@/types';

export default function GardenPage() {
  const { gardens, plantings, currentUser } = useAppStore();
  const currentGarden = gardens[0];
  const [selectedPlanting, setSelectedPlanting] = useState<Planting | null>(plantings[0] || null);

  const forecast = calculateGardenForecast(plantings);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-forest-700 uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>Zone 5a Garden Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-1">
            My Garden & Yield Forecast
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Real-time harvest surplus calculation for {currentUser.display_name}&apos;s Ottawa South backyard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/plan"
            className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span>2027 Crop Optimizer →</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-mono uppercase text-stone-500">Total Expected Yield</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
            {forecast.totalEstimatedYieldLbs} lb
          </div>
          <p className="text-[11px] text-stone-400">Across 4 active raised beds</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-mono uppercase text-stone-500">Household Needs</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600">
            {forecast.totalHouseholdUseLbs} lb
          </div>
          <p className="text-[11px] text-stone-400">Family fresh eating & canning</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-mono uppercase text-stone-500">Projected Surplus</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
            {forecast.totalSurplusLbs} lb
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Available to sell or barter</p>
        </div>

        <div className="p-5 rounded-2xl bg-forest-950 text-white border border-forest-800 shadow-md space-y-1">
          <div className="text-xs font-mono uppercase text-forest-300">Estimated Trade Value</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            {formatCurrency(forecast.totalPotentialValueCad)}
          </div>
          <p className="text-[11px] text-forest-300">In Ottawa GrowSwap credit</p>
        </div>
      </div>

      {/* Main Bed Visualizer Component */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>Raised Bed Layout & Planting Grid</span>
          </h3>
          <span className="text-xs text-stone-500 font-mono">Click a crop to inspect seasonal breakdown</span>
        </div>

        <BedVisualizer
          garden={currentGarden}
          plantings={plantings}
          onSelectPlanting={(p) => setSelectedPlanting(p)}
        />
      </div>

      {/* Monthly Harvest & Surplus Projection Table */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Monthly Harvest Timeline (May – October 2026)
            </h3>
            <p className="text-xs text-stone-500">
              Deterministic yield distribution based on Ottawa frost dates (May 10 last frost / Oct 5 first frost).
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
            Zone 5a Verified
          </span>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {forecast.monthlyBreakdown.map((m) => (
            <div
              key={m.month}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                m.month === 'Aug'
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-xs scale-105'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 font-mono">{m.month}</span>
                {m.month === 'Aug' && (
                  <span className="text-[9px] uppercase font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                    Peak
                  </span>
                )}
              </div>

              <div className="font-mono text-stone-800 font-black text-xl">
                {m.expectedLbs} <span className="text-xs font-normal text-stone-500">lb</span>
              </div>

              <div className="pt-2 border-t border-stone-200/60 text-[11px] font-mono space-y-0.5 text-left">
                <div className="flex justify-between text-stone-500">
                  <span>Home:</span>
                  <span>{m.householdUseLbs} lb</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Surplus:</span>
                  <span>{m.surplusLbs} lb</span>
                </div>
                <div className="flex justify-between text-stone-700 font-semibold pt-0.5">
                  <span>Val:</span>
                  <span>{formatCurrency(m.estimatedValueCad)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
