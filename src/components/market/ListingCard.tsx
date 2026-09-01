'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, RefreshCw, Sparkles, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { Listing } from '@/types';
import { formatCurrency, getHarvestFreshnessBadge } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const isRescue = listing.listing_type === 'RESCUE' || listing.is_rescue;
  const isSwap = listing.listing_type === 'SWAP';
  const freshness = getHarvestFreshnessBadge(listing.harvested_at);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Top Image & Badges */}
        <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
          {listing.images && listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-forest-50">
              {listing.product?.emoji || '🥬'}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {isRescue ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-white shadow-md flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Surplus Rescue</span>
              </span>
            ) : isSwap ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-md flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Barter / Swap</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-600 text-white shadow-md">
                Fresh Harvest
              </span>
            )}

            <span className={`px-2 py-0.5 rounded-md text-[10px] shadow-xs font-mono ${freshness.colorClass}`}>
              {freshness.label}
            </span>
          </div>

          {/* Price / Value Overlay */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-stone-900/85 backdrop-blur-md text-white font-mono text-xs shadow-md">
            {isRescue ? (
              <span className="text-emerald-300 font-bold">FREE PICKUP</span>
            ) : listing.price ? (
              <div>
                <span className="font-bold text-sm text-white">{formatCurrency(listing.price)}</span>
                <span className="text-stone-300 text-[10px]">/{listing.unit}</span>
              </div>
            ) : (
              <span className="text-indigo-300 font-bold">TRADE ONLY</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-600 font-mono">
            <span className="flex items-center gap-1 text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-forest-600" />
              <span>{listing.community_name || 'Ottawa'}</span>
            </span>
            <span className="font-semibold text-stone-700">
              {listing.quantity_available} {listing.unit} available
            </span>
          </div>

          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-forest-700 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* GrowSwap Value Index Reference */}
          {listing.growswap_value && (
            <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Suggested Value:</span>
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {formatCurrency(listing.growswap_value)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Grower Chip & Action */}
      <div className="px-4 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
        <Link
          href={`/grower/${listing.seller?.username || 'alex_ottawa'}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-6 rounded-full bg-forest-100 overflow-hidden flex items-center justify-center text-xs">
            {listing.seller?.avatar_url ? (
              <img src={listing.seller.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>🌱</span>
            )}
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-stone-800 block leading-none">
              {listing.seller?.display_name?.split(' ')[0]}
            </span>
            <span className="text-[10px] text-forest-700 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>{listing.seller?.rating_average || 5.0}★</span>
            </span>
          </div>
        </Link>

        <Link
          href={`/market/${listing.id}`}
          className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-forest-700 text-white text-xs font-medium transition-colors"
        >
          Details →
        </Link>
      </div>
    </div>
  );
}
