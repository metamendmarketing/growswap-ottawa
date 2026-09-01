'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ShoppingBag, 
  RefreshCw, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/data/seed-products';
import { calculateGrowSwapValue } from '@/lib/pricing-engine';
import { formatCurrency } from '@/lib/utils';
import { useAppStore } from '@/lib/data/store';
import { ListingCard } from '@/components/market/ListingCard';

export default function ProductIntelligencePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { listings } = useAppStore();

  const product = SEED_PRODUCTS.find((p) => p.slug === slug) || SEED_PRODUCTS[0];
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | 'SEASON' | '1Y'>('SEASON');

  const priceCalc = calculateGrowSwapValue(product);
  const matchingListings = listings.filter((l) => l.product?.slug === product.slug);

  // Mock pricing history curve across the season
  const seasonalPriceData = [
    { label: 'May', price: product.base_price * 1.35, supply: 10, demand: 85 },
    { label: 'Jun', price: product.base_price * 1.20, supply: 30, demand: 90 },
    { label: 'Jul', price: product.base_price * 1.05, supply: 70, demand: 95 },
    { label: 'Aug', price: product.base_price * 0.88, supply: 100, demand: 100 },
    { label: 'Sep', price: product.base_price * 0.92, supply: 85, demand: 90 },
    { label: 'Oct', price: product.base_price * 1.15, supply: 35, demand: 75 },
    { label: 'Nov', price: product.base_price * 1.30, supply: 15, demand: 60 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Food Grid</span>
      </button>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-forest-950 text-white border border-forest-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-900 border border-forest-700 flex items-center justify-center text-4xl shadow-md">
            {product.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <span>Ottawa Product Intelligence Index</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Ottawa {product.name_en} Index
            </h1>
            <p className="text-xs text-forest-200 mt-1 max-w-xl">
              {product.description_en}
            </p>
          </div>
        </div>

        {/* Current Suggested Value Chip */}
        <div className="p-4 rounded-2xl bg-forest-900/90 border border-forest-700/80 text-right font-mono self-stretch md:self-auto">
          <span className="text-[11px] text-forest-300 block">Suggested Reference Value</span>
          <span className="text-3xl font-black text-emerald-400">
            {formatCurrency(priceCalc.suggested_growswap_value)}
          </span>
          <span className="text-xs text-stone-300 block">per {product.default_unit}</span>
        </div>
      </div>

      {/* Pricing Trend & Supply Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Seasonal Price & Supply Graph */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-forest-600" />
                <span>Zone 5a Seasonal Pricing & Availability Curve</span>
              </h3>
              <p className="text-xs text-stone-500">
                Plausible seasonal benchmark curve reflecting harvest glut in August.
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-mono">
              {(['7D', '30D', 'SEASON', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    timeframe === tf ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Rendered Visual Chart Bars */}
          <div className="grid grid-cols-7 gap-2 h-56 items-end pt-4 pb-2 border-b border-stone-100 font-mono">
            {seasonalPriceData.map((d) => {
              const heightPercent = Math.min(100, Math.max(20, (d.price / (product.base_price * 1.4)) * 100));
              const isPeak = d.label === 'Aug';

              return (
                <div key={d.label} className="flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] text-stone-600 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${d.price.toFixed(2)}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 group-hover:scale-105 ${
                      isPeak
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md'
                        : 'bg-stone-200 group-hover:bg-forest-300'
                    }`}
                  />
                  <div className={`text-xs mt-2 font-bold ${isPeak ? 'text-emerald-700' : 'text-stone-500'}`}>
                    {d.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-stone-500 pt-1">
            <span>• Peak Harvest: August – September</span>
            <span>• Supply Gluts Lower Reference Value to $2.65/lb</span>
          </div>
        </div>

        {/* Right Col: Product Fundamentals */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-base text-stone-900">Crop Profile</h3>
            <div className="space-y-2.5 font-mono text-xs text-stone-700">
              <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                <span>Category:</span>
                <span className="font-bold">{product.category}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                <span>Base Retail Ref:</span>
                <span className="font-bold">${product.base_price.toFixed(2)}/{product.default_unit}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                <span>Growing Period:</span>
                <span className="font-bold">{product.growing_days || 75} days</span>
              </div>
              <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                <span>Expected Plant Yield:</span>
                <span className="font-bold">{product.yield_per_plant || 10} {product.yield_unit || 'lb'}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                <span>Active Listings:</span>
                <span className="font-bold text-emerald-700">{matchingListings.length} in Ottawa</span>
              </div>
            </div>
          </div>

          <Link
            href={`/market?tab=ALL`}
            className="w-full py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold text-center transition-colors block"
          >
            Search Listings for {product.name_en} →
          </Link>
        </div>
      </div>

      {/* Available Listings for this Product */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 className="font-bold text-lg text-stone-900">
            Active Ottawa Listings ({matchingListings.length})
          </h3>
          <span className="text-xs font-mono text-stone-500">Pick up in Ottawa South, Nepean, Glebe</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingListings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
