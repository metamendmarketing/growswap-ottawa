'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarDays, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sprout, 
  Sliders, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { generate2027PlanRecommendations } from '@/lib/garden-forecaster';
import { formatCurrency } from '@/lib/utils';

export default function PlanPage() {
  const { plantings, currentUser } = useAppStore();
  const [isOptimized, setIsOptimized] = useState(false);
  const [primaryGoal, setPrimaryGoal] = useState<'MAX_BARTER' | 'SELF_RELIANCE' | 'MIN_EFFORT'>('MAX_BARTER');

  const recommendations = generate2027PlanRecommendations(plantings);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase tracking-wider">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Ottawa Distributed Farm Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-1">
            2027 Garden Season Planner
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Optimize your raised beds based on real Ottawa supply gaps, shortage indexes, and local barter demand.
          </p>
        </div>

        <button
          onClick={() => setIsOptimized(!isOptimized)}
          className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
            isOptimized
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-stone-900 hover:bg-forest-700 text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isOptimized ? '✓ 2027 Plan Optimized' : 'Run 2027 Network Optimizer'}</span>
        </button>
      </div>

      {/* Goal & Preferences Bar */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-forest-600" />
          <span>Set Your 2027 Household Garden Priority</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setPrimaryGoal('MAX_BARTER')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              primaryGoal === 'MAX_BARTER'
                ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="text-xs font-bold text-stone-900">Maximize Barter Power (Recommended)</div>
            <div className="text-[11px] text-stone-500 mt-1">
              Grow high-scarcity items (hardneck garlic, potatoes, heirloom tomatoes) to trade for honey, eggs, and fruit.
            </div>
          </button>

          <button
            onClick={() => setPrimaryGoal('SELF_RELIANCE')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              primaryGoal === 'SELF_RELIANCE'
                ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="text-xs font-bold text-stone-900">Maximum Calorie & Canning Yield</div>
            <div className="text-[11px] text-stone-500 mt-1">
              Focus on long-storage staples (winter squash, paste tomatoes, root crops, onions).
            </div>
          </button>

          <button
            onClick={() => setPrimaryGoal('MIN_EFFORT')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              primaryGoal === 'MIN_EFFORT'
                ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="text-xs font-bold text-stone-900">Low-Maintenance Pollinator Bed</div>
            <div className="text-[11px] text-stone-500 mt-1">
              Perennial herbs, hardy brassicas, and native companion flowers.
            </div>
          </button>
        </div>
      </div>

      {/* Comparison: Current 2026 vs. Optimized 2027 Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-forest-600" />
            <span>Ottawa Network Recommendations for Alex&apos;s 600 sq ft Garden</span>
          </h3>
          <span className="text-xs font-mono text-emerald-700 font-semibold">
            {isOptimized ? 'Status: Network Aligned' : 'Status: Baseline 2026 Configuration'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => {
            const isDecreased = rec.change_type === 'DECREASE';
            const isNew = rec.change_type === 'NEW_CROP';

            return (
              <div
                key={rec.product_id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                  isOptimized
                    ? isDecreased
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'bg-emerald-50/40 border-emerald-300 shadow-md'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{rec.product.emoji}</span>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{rec.product.name_en}</h4>
                        <span className="text-[10px] font-mono text-stone-500">
                          Demand: {rec.projected_local_demand}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        isDecreased
                          ? 'bg-amber-100 text-amber-800'
                          : isNew
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {rec.change_type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Allocation Numbers */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-2xl bg-stone-100/80 font-mono text-xs">
                    <div>
                      <div className="text-stone-500 text-[10px]">2026 Plan:</div>
                      <div className="font-bold text-stone-800">
                        {rec.current_plantings > 0 ? `${rec.current_plantings} plants` : '0 (None)'}
                      </div>
                    </div>
                    <div>
                      <div className="text-stone-500 text-[10px]">2027 Optimized:</div>
                      <div className={`font-black ${isDecreased ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {rec.recommended_plantings} {rec.product.yield_unit || 'plants'}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {rec.rationale_en}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs font-mono text-stone-600">
                  <span>Est. Barter Surplus:</span>
                  <span className="font-bold text-emerald-700">
                    {rec.expected_surplus_lbs} lb ({formatCurrency(rec.estimated_trade_value)})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Impact Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-forest-950 via-stone-900 to-forest-950 text-white border border-forest-800 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              2027 Network Optimization Summary
            </span>
            <h3 className="text-2xl font-bold">
              +140% Potential Barter Value with Zero Increase in Garden Footprint
            </h3>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              By replacing zucchini gluts with fall-planted Ontario Music Garlic and Yukon Gold potatoes, your garden beds generate $438+ in high-demand barter power next summer while helping eliminate Ottawa food waste.
            </p>
          </div>

          <Link
            href="/garden"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all whitespace-nowrap"
          >
            Apply Plan to My Raised Beds →
          </Link>
        </div>
      </div>
    </div>
  );
}
