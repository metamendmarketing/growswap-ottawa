'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Sprout, 
  Star, 
  RefreshCw, 
  MessageSquare,
  Award
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { DEMO_USER_PROFILE } from '@/lib/data/seed-data';
import { ListingCard } from '@/components/market/ListingCard';

export default function GrowerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;
  const { profiles, listings, wants } = useAppStore();

  const profile = profiles.find((p) => p.username === username) || DEMO_USER_PROFILE;
  const growerListings = listings.filter((l) => l.seller_id === profile.id || l.seller?.username === profile.username);
  const growerWants = wants.filter((w) => w.user_id === profile.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-forest-100 overflow-hidden border-2 border-forest-500 shadow-md flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">🌱</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">{profile.display_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{profile.verification_level}</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono">@{profile.username}</p>
            <div className="flex items-center gap-3 text-xs text-stone-600 pt-1">
              <span className="flex items-center gap-1 text-forest-700">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.community_name || 'Old Ottawa South'} (Privacy 350m)</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-stone-800">
                ★ {profile.rating_average} ({profile.completed_exchanges} exchanges)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/swap"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Propose Barter Swap</span>
          </Link>
        </div>
      </div>

      {/* Bio & Wants Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bio Card */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-forest-600" />
            <span>Grower Bio & Gardening Style</span>
          </h3>
          <p className="text-xs text-stone-700 leading-relaxed">
            {profile.bio || 'Backyard grower contributing fresh produce to the Ottawa hyperlocal exchange.'}
          </p>
          <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-xs font-mono text-stone-600">
            <div>Pickup: {profile.pickup_enabled ? '✓ Enabled' : '✗ No'}</div>
            <div>Delivery: {profile.delivery_enabled ? '✓ Available' : '✗ No'}</div>
            <div>Radius: {profile.default_radius_km} km</div>
          </div>
        </div>

        {/* Wants Wishlist */}
        <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Wanted in Return</span>
          </h3>
          <p className="text-xs text-amber-800/80">
            Items this grower is actively seeking in barter:
          </p>
          <div className="space-y-1.5 font-mono text-xs">
            {growerWants.length > 0 ? (
              growerWants.map((w) => (
                <div key={w.id} className="p-2 bg-white rounded-lg border border-amber-200 flex justify-between">
                  <span className="font-semibold text-stone-900">{w.product?.name_en || 'Crops'}</span>
                  <span className="text-amber-700 font-bold">{w.desired_quantity} {w.unit}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-stone-500">Eggs, garlic, root crops, raw honey.</div>
            )}
          </div>
        </div>
      </div>

      {/* Active Listings from this Grower */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 className="font-bold text-lg text-stone-900">
            Current Harvest Listings ({growerListings.length})
          </h3>
          <span className="text-xs font-mono text-stone-500">Direct from garden beds</span>
        </div>

        {growerListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {growerListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-500 font-mono">
            No active listings right now from this grower.
          </div>
        )}
      </div>
    </div>
  );
}
