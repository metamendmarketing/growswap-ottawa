'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, MapPin, RefreshCw } from 'lucide-react';
import { SwapMatch } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface MultiSwapGraphProps {
  swapMatch: SwapMatch;
  onPropose?: () => void;
}

export function MultiSwapGraph({ swapMatch, onPropose }: MultiSwapGraphProps) {
  const [proposed, setProposed] = React.useState(false);

  const handlePropose = () => {
    setProposed(true);
    if (onPropose) onPropose();
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900">
                {swapMatch.type === 'THREE_WAY' ? '3-Party Circular Barter Loop' : 'Direct 2-Way Exchange'}
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                {swapMatch.match_score}% MATCH
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{swapMatch.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700">
            <span className="text-stone-400">Variance: </span>
            <span className="font-bold text-emerald-600">{swapMatch.value_variance_percent}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700">
            <span className="text-stone-400">Total Route: </span>
            <span className="font-bold text-indigo-600">{swapMatch.total_distance_km} km</span>
          </div>
        </div>
      </div>

      {/* Trade Cycle Diagram / Step-by-Step Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {swapMatch.legs.map((leg, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 shadow-xs"
          >
            {/* From -> To header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                  {index + 1}
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {leg.from_profile.display_name.split(' ')[0]}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400" />
              <div className="text-xs font-bold text-stone-900">
                {leg.to_profile.display_name.split(' ')[0]}
              </div>
            </div>

            {/* Product Card */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-3">
              <span className="text-3xl">{leg.giving_product.emoji || '🥬'}</span>
              <div className="flex-1">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {leg.giving_quantity} {leg.giving_unit} {leg.giving_product.name_en}
                </div>
                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                  Est. Value: {formatCurrency(leg.giving_value)}
                </div>
              </div>
            </div>

            {/* Route subtext */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono pt-1 border-t border-stone-200/60">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-forest-600" />
                <span>{leg.from_profile.community_name || 'Ottawa'}</span>
              </span>
              <span>{leg.distance_km} km pickup</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rationale & Action Card */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-indigo-950 uppercase font-mono tracking-wide">
              Deterministic Graph Optimization
            </h4>
            <p className="text-xs text-indigo-900/80 leading-relaxed mt-0.5">
              {swapMatch.benefits_explanation}
            </p>
          </div>
        </div>

        <button
          onClick={handlePropose}
          disabled={proposed}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 cursor-pointer shadow-md ${
            proposed
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
          }`}
        >
          {proposed ? '✓ Proposal Broadcast to Network' : 'Propose 3-Way Exchange →'}
        </button>
      </div>
    </div>
  );
}
