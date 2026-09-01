'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Sliders,
  Award,
  Zap
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { MultiSwapGraph } from '@/components/swap/MultiSwapGraph';
import { OttawaMap } from '@/components/map/OttawaMap';
import { formatCurrency } from '@/lib/utils';
import { SwapMatch } from '@/types';

export default function SwapMatchPage() {
  const { currentUser, getSwapMatchesForCurrentUser } = useAppStore();
  const [selectedMatchTab, setSelectedMatchTab] = useState<'ALL' | 'MULTI_WAY' | 'TWO_WAY'>('ALL');

  const matches = getSwapMatchesForCurrentUser();
  const multiWayMatches = matches.filter((m) => m.type === 'THREE_WAY' || m.type === 'FOUR_WAY');
  const twoWayMatches = matches.filter((m) => m.type === 'TWO_WAY');

  const displayedMatches = 
    selectedMatchTab === 'MULTI_WAY' 
      ? multiWayMatches 
      : selectedMatchTab === 'TWO_WAY' 
      ? twoWayMatches 
      : matches;

  const [activeVisualMatch, setActiveVisualMatch] = useState<SwapMatch | null>(multiWayMatches[0] || matches[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Directed Graph Barter Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-1">
            SwapMatch Multi-Party Solver
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Matching what you have with what Ottawa growers want. Resolving multi-party trade cycles in $0.00 cash transactions.
          </p>
        </div>

        {/* Status Pill */}
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            3-Way
          </div>
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-indigo-950">97% Optimal Cycle Found</div>
            <div className="text-[10px] text-indigo-700">Alex ➔ David ➔ Sarah ➔ Alex</div>
          </div>
        </div>
      </div>

      {/* Embedded Swap Route Visualizer Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>Active Ottawa Triangular Trade Route Overlay</span>
          </h3>
          <span className="text-xs font-mono text-stone-500">14.8 km Ottawa triangular loop</span>
        </div>
        <OttawaMap
          heightClassName="h-[480px]"
          initialLayer="SWAPS"
          showSidebar={false}
          activeSwapMatch={activeVisualMatch}
        />
      </div>

      {/* Match Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setSelectedMatchTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedMatchTab === 'ALL'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          All Matches ({matches.length})
        </button>
        <button
          onClick={() => setSelectedMatchTab('MULTI_WAY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedMatchTab === 'MULTI_WAY'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <span>3-Way Cycles ({multiWayMatches.length})</span>
          <span className="px-1.5 py-0.2 bg-indigo-500 text-white text-[10px] rounded-full">Optimal</span>
        </button>
        <button
          onClick={() => setSelectedMatchTab('TWO_WAY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedMatchTab === 'TWO_WAY'
              ? 'bg-forest-600 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Direct 2-Way ({twoWayMatches.length})
        </button>
      </div>

      {/* Rendered Matches List */}
      <div className="space-y-6">
        {displayedMatches.map((match) => (
          <div key={match.id} onClick={() => setActiveVisualMatch(match)}>
            <MultiSwapGraph swapMatch={match} />
          </div>
        ))}
      </div>

      {/* Rubric Breakdown Explainer */}
      <div className="p-6 rounded-3xl bg-stone-900 text-stone-200 border border-stone-800 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">How SwapMatch Computes Cycle Scores (100 pts)</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="text-emerald-400 font-bold text-base">35 pts</div>
            <div className="text-stone-400 mt-1">Product Compatibility</div>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="text-emerald-400 font-bold text-base">20 pts</div>
            <div className="text-stone-400 mt-1">Value Balance</div>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="text-emerald-400 font-bold text-base">15 pts</div>
            <div className="text-stone-400 mt-1">Distance & Route</div>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="text-emerald-400 font-bold text-base">10 pts</div>
            <div className="text-stone-400 mt-1">Quantity Fit</div>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="text-emerald-400 font-bold text-base">10 pts</div>
            <div className="text-stone-400 mt-1">Pickup Overlap</div>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="text-emerald-400 font-bold text-base">5 pts</div>
            <div className="text-stone-400 mt-1">Harvest Freshness</div>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="text-emerald-400 font-bold text-base">5 pts</div>
            <div className="text-stone-400 mt-1">Grower Trust</div>
          </div>
        </div>
      </div>
    </div>
  );
}
