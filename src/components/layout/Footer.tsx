'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Heart, Shield, Sparkles, MapPin } from 'lucide-react';
import { OTTAWA_COMMUNITIES } from '@/lib/data/ottawa-geo';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-bold text-lg text-white">GrowSwap Ottawa</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Ottawa&apos;s hyperlocal food intelligence and barter network. Transforming 500+ backyards, balconies, and community gardens into one interconnected distributed farm.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-forest-400 pt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>All residential locations privacy-obfuscated</span>
            </div>
          </div>

          {/* Core Routes */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold mb-3">Network</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/map" className="hover:text-white transition-colors">Living Ottawa Map</Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-white transition-colors">Hyperlocal Marketplace</Link>
              </li>
              <li>
                <Link href="/swap" className="hover:text-white transition-colors">SwapMatch Engine</Link>
              </li>
              <li>
                <Link href="/garden" className="hover:text-white transition-colors">My Garden & Yields</Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-white transition-colors">2027 Season Planner</Link>
              </li>
              <li>
                <Link href="/ottawa" className="hover:text-white transition-colors">Ottawa Food Grid</Link>
              </li>
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold mb-3 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Ottawa Hubs</span>
            </h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-stone-400">
              {OTTAWA_COMMUNITIES.slice(0, 8).map((c) => (
                <Link key={c.slug} href={`/community/${c.slug}`} className="hover:text-emerald-400 transition-colors">
                  {c.name_en.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* Demo & Architecture */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold mb-3 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Network State</span>
            </h3>
            <p className="text-xs text-stone-400 mb-3">
              Running in Standalone Demo Mode with PostGIS geometry, graph cycle detection, and dynamic pricing indexing.
            </p>
            <Link
              href="/admin"
              className="inline-block px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition-colors"
            >
              Control Panel & Reset →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <div>
            © 2026 GrowSwap Ottawa • Built for the City of Ottawa Food Security Initiative
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for local growers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
