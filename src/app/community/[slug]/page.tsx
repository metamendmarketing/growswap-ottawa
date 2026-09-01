'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Sprout, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { OTTAWA_COMMUNITIES, OTTAWA_COMMUNITY_GARDENS } from '@/lib/data/ottawa-geo';
import { useAppStore } from '@/lib/data/store';
import { ListingCard } from '@/components/market/ListingCard';

export default function CommunityPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { listings, profiles } = useAppStore();

  const community = OTTAWA_COMMUNITIES.find((c) => c.slug === slug) || OTTAWA_COMMUNITIES[0];
  const communityListings = listings.filter((l) => l.community_name === community.name_en);
  const communityGrowers = profiles.filter((p) => p.community_name === community.name_en || p.community_id === community.id);

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

      {/* Community Header */}
      <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-forest-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Ward {community.ward_number || 17}: {community.ward_name || 'Ottawa Capital'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            {community.name_en} Food Hub
          </h1>
          <p className="text-xs text-stone-500 font-mono">
            {community.type} District • {community.active_growers_count || 45} Active Backyard & Allotment Growers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/market?action=add-harvest"
            className="px-5 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Sprout className="w-4 h-4" />
            <span>Add Harvest in {community.name_en.split(' ')[0]}</span>
          </Link>
        </div>
      </div>

      {/* Community Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-xs text-stone-500">Active Growers</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{community.active_growers_count}</div>
        </div>
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-xs text-stone-500">Live Listings</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{community.total_listings_count}</div>
        </div>
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-xs text-stone-500">Avg Radius</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">4.2 km</div>
        </div>
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-xs text-stone-500">Peak Surplus</div>
          <div className="text-2xl font-black text-amber-600 mt-1">Tomatoes / Zucchini</div>
        </div>
      </div>

      {/* Active Listings in this Community */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 className="font-bold text-lg text-stone-900">
            Available Produce in {community.name_en}
          </h3>
          <span className="text-xs font-mono text-stone-500">
            {communityListings.length} local listings
          </span>
        </div>

        {communityListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityListings.slice(0, 9).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-500 font-mono">
            No active listings right now in this ward. Be the first to list a harvest!
          </div>
        )}
      </div>
    </div>
  );
}
