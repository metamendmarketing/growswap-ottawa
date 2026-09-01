'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  RefreshCw, 
  Calendar, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { SEED_PRODUCTS } from '@/lib/data/seed-products';
import { OTTAWA_COMMUNITIES } from '@/lib/data/ottawa-geo';

export default function AdminPage() {
  const { 
    listings, 
    profiles, 
    wants, 
    plantings, 
    demoDate, 
    setDemoDate, 
    resetDemoData 
  } = useAppStore();

  const [resetSuccess, setResetSuccess] = useState(false);
  const [activeDateInput, setActiveDateInput] = useState(demoDate);

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleDateSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoDate(activeDateInput);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-forest-700 uppercase tracking-wider">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform & Demo Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-1">
            GrowSwap Ottawa Administration
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Manage simulated seed data, PostGIS privacy parameters, and time-machine demo dates.
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-full border border-emerald-300">
          Demo Mode: ACTIVE
        </span>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500">Profiles</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{profiles.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500">Live Listings</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{listings.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500">Tracked Wants</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{wants.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500">Crops Catalog</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{SEED_PRODUCTS.length}</div>
        </div>
      </div>

      {/* Demo Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reset Seed Data */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-forest-600" />
              <h3 className="font-bold text-base text-stone-900">Reset Demo Network Data</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Resets all 500 growers, listings, Alex&apos;s garden plantings, and restores the guaranteed 3-way circular trade match (Alex ➔ David ➔ Sarah ➔ Alex).
            </p>
          </div>

          {resetSuccess ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Demo seed dataset reloaded successfully!</span>
            </div>
          ) : (
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-forest-700 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload 500+ Ottawa Seed Profiles</span>
            </button>
          )}
        </div>

        {/* Demo Time Machine Date */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-stone-900">Demo Date Controller</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Lock the application to peak harvest season (2026-08-24) to ensure abundant tomato, zucchini, and egg listings during live presentations.
            </p>
          </div>

          <form onSubmit={handleDateSave} className="flex gap-2">
            <input
              type="date"
              value={activeDateInput}
              onChange={(e) => setActiveDateInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-medium focus:ring-2 focus:ring-forest-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-mono transition-colors"
            >
              Set Date
            </button>
          </form>
        </div>
      </div>

      {/* Ottawa GIS & Database Specs */}
      <div className="p-6 rounded-3xl bg-stone-900 text-stone-200 border border-stone-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <span className="text-emerald-400 font-bold flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>PostGIS & Supabase Topology</span>
          </span>
          <span className="text-stone-400">EPSG:4326 Normalized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
            <div className="text-stone-400">Urban Privacy Offset:</div>
            <div className="text-white font-bold">250m – 500m Jitter</div>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
            <div className="text-stone-400">Rural Privacy Offset:</div>
            <div className="text-white font-bold">500m – 1000m Jitter</div>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
            <div className="text-stone-400">Barter Graph Length:</div>
            <div className="text-white font-bold">Cycles Length 2, 3, 4</div>
          </div>
        </div>
      </div>
    </div>
  );
}
