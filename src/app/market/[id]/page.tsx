'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  Send, 
  AlertCircle,
  TrendingUp,
  Share2
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { formatCurrency, getHarvestFreshnessBadge } from '@/lib/utils';
import { calculateGrowSwapValue, evaluateSwapFairness } from '@/lib/pricing-engine';
import { SEED_PRODUCTS } from '@/lib/data/seed-products';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { listings, currentUser } = useAppStore();
  const listingId = params?.id as string;

  const listing = listings.find((l) => l.id === listingId) || listings[0];
  const [offerType, setOfferType] = useState<'SWAP' | 'BUY'>('SWAP');
  const [selectedOfferCrop, setSelectedOfferCrop] = useState(SEED_PRODUCTS[0].slug);
  const [offerQuantity, setOfferQuantity] = useState<number>(8);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Listing not found</h2>
        <Link href="/market" className="text-forest-600 font-semibold text-sm mt-4 inline-block">
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  const freshness = getHarvestFreshnessBadge(listing.harvested_at);
  const product = listing.product || SEED_PRODUCTS[0];
  const priceCalc = calculateGrowSwapValue(product);

  const offerCrop = SEED_PRODUCTS.find((p) => p.slug === selectedOfferCrop) || SEED_PRODUCTS[0];
  const offerValue = offerCrop.base_price * offerQuantity;
  const listingValue = listing.growswap_value || (listing.price || 3) * listing.quantity_available;
  const fairness = evaluateSwapFairness(offerValue, listingValue);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Photography, Description, Valuation Engine */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Card */}
          <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-stone-900 shadow-xl border border-stone-200">
            {listing.images && listing.images[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl bg-forest-900">
                {product.emoji}
              </div>
            )}

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold shadow-md ${freshness.colorClass}`}>
                {freshness.label}
              </span>
              {listing.is_rescue && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500 text-white shadow-md">
                  🚨 Surplus Rescue
                </span>
              )}
            </div>
          </div>

          {/* Title & Core Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-forest-600" />
                <span>{listing.community_name || 'Old Ottawa South'} (Privacy grid 350m)</span>
              </div>
              <span className="text-xs font-mono text-stone-400">
                ID: {listing.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              {listing.title}
            </h1>

            <p className="text-sm text-stone-700 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* GrowSwap Intelligence & Price Decomposition Card */}
          <div className="p-6 rounded-3xl bg-forest-950 text-white border border-forest-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-forest-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Suggested GrowSwap Valuation</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-forest-900 px-2.5 py-1 rounded-lg border border-forest-700">
                PRICING ENGINE FORMULA
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-forest-900/80 border border-forest-800">
                <div className="text-stone-400">Retail Ref:</div>
                <div className="text-base font-bold text-white mt-1">${priceCalc.base_benchmark.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-forest-900/80 border border-forest-800">
                <div className="text-stone-400">Listing Median:</div>
                <div className="text-base font-bold text-white mt-1">${priceCalc.listing_median.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-forest-900/80 border border-forest-800">
                <div className="text-stone-400">Supply/Demand:</div>
                <div className="text-base font-bold text-emerald-400 mt-1">{priceCalc.supply_demand_factor}x</div>
              </div>
              <div className="p-3 rounded-xl bg-forest-900/80 border border-forest-800">
                <div className="text-stone-400">Seasonal Index:</div>
                <div className="text-base font-bold text-cyan-300 mt-1">{priceCalc.season_factor}x</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-forest-800/80">
              <div>
                <span className="text-xs text-stone-300">Suggested Unit Value: </span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {formatCurrency(priceCalc.suggested_growswap_value)} / {listing.unit}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-300">Total Lot Value: </span>
                <span className="text-xl font-extrabold font-mono text-white">
                  {formatCurrency(priceCalc.suggested_growswap_value * listing.quantity_available)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Grower Profile & Interactive Barter Calculator */}
        <div className="space-y-6">
          {/* Grower Profile Card */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-100 overflow-hidden flex items-center justify-center">
                {listing.seller?.avatar_url ? (
                  <img src={listing.seller.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🌱</span>
                )}
              </div>
              <div>
                <Link
                  href={`/grower/${listing.seller?.username || 'alex_ottawa'}`}
                  className="font-bold text-base text-stone-900 hover:text-forest-700 block"
                >
                  {listing.seller?.display_name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                  <span className="text-emerald-700 font-bold">★ {listing.seller?.rating_average}</span>
                  <span>•</span>
                  <span>{listing.seller?.completed_exchanges} swaps</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {listing.seller?.bio || 'Ottawa urban grower.'}
            </p>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-mono">
              <span>Verification:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{listing.seller?.verification_level}</span>
              </span>
            </div>
          </div>

          {/* Interactive Barter / Offer Card */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900">Make an Exchange Offer</h3>
              <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs font-mono">
                <button
                  onClick={() => setOfferType('SWAP')}
                  className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                    offerType === 'SWAP' ? 'bg-indigo-600 text-white' : 'text-stone-600'
                  }`}
                >
                  Swap
                </button>
                <button
                  onClick={() => setOfferType('BUY')}
                  className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                    offerType === 'BUY' ? 'bg-forest-600 text-white' : 'text-stone-600'
                  }`}
                >
                  Buy
                </button>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950">Proposal Dispatched!</h4>
                <p className="text-xs text-emerald-800">
                  {listing.seller?.display_name} has been notified in their GrowSwap Ottawa inbox.
                </p>
              </div>
            ) : offerType === 'SWAP' ? (
              <form onSubmit={handleSendProposal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    What crop are you offering in return?
                  </label>
                  <select
                    value={selectedOfferCrop}
                    onChange={(e) => setSelectedOfferCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-stone-50 text-stone-900 focus:ring-2 focus:ring-forest-600"
                  >
                    {SEED_PRODUCTS.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.emoji} {p.name_en} (${p.base_price.toFixed(2)}/{p.default_unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Offered Quantity ({offerCrop.default_unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={offerQuantity}
                    onChange={(e) => setOfferQuantity(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                {/* Fair-swap balance indicator */}
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${fairness.colorClass}`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>{fairness.labelEn}</span>
                    <span>{fairness.variancePercent}% variance</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>Your offer: {formatCurrency(offerValue)}</span>
                    <span>Lot value: {formatCurrency(listingValue)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Note for {listing.seller?.display_name.split(' ')[0]}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Can meet at Brewer Park or do porch pickup!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Direct Barter Proposal</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
                  <div className="text-2xl font-black font-mono text-stone-900">
                    {formatCurrency(listing.price ? listing.price * listing.quantity_available : 15.0)}
                  </div>
                  <div className="text-xs text-stone-500 font-mono">
                    for all {listing.quantity_available} {listing.unit}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Purchase & Pickup</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
