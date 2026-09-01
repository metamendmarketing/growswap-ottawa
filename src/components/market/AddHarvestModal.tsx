'use client';

import React, { useState } from 'react';
import { X, Sprout, Sparkles, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { ListingType, Product } from '@/types';
import { SEED_PRODUCTS } from '@/lib/data/seed-products';
import { calculateGrowSwapValue } from '@/lib/pricing-engine';
import { useAppStore } from '@/lib/data/store';
import { formatCurrency } from '@/lib/utils';

interface AddHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddHarvestModal({ isOpen, onClose, onSuccess }: AddHarvestModalProps) {
  const { currentUser, addListing } = useAppStore();

  const [selectedProductId, setSelectedProductId] = useState<string>(SEED_PRODUCTS[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(5);
  const [listingType, setListingType] = useState<ListingType>('SALE_OR_SWAP');
  const [customPrice, setCustomPrice] = useState<number>(3.0);
  const [isPickupOnly, setIsPickupOnly] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const selectedProduct = SEED_PRODUCTS.find((p) => p.id === selectedProductId) || SEED_PRODUCTS[0];
  const priceCalc = calculateGrowSwapValue(selectedProduct);
  const suggestedTotal = priceCalc.suggested_growswap_value * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isRescue = listingType === 'RESCUE';

    addListing({
      seller_id: currentUser.id,
      seller: currentUser,
      product_id: selectedProduct.id,
      product: selectedProduct,
      title: title || `${quantity} ${selectedProduct.default_unit} Fresh ${selectedProduct.name_en}`,
      description: description || `Freshly picked organic ${selectedProduct.name_en} from ${currentUser.community_name || 'Ottawa'}.`,
      listing_type: listingType,
      quantity_available: quantity,
      unit: selectedProduct.default_unit,
      price: isRescue ? 0 : (customPrice || selectedProduct.base_price),
      growswap_value: suggestedTotal,
      harvested_at: new Date().toISOString(),
      available_from: new Date().toISOString(),
      available_until: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      accepts_swap: listingType === 'SWAP' || listingType === 'SALE_OR_SWAP',
      open_to_any_swap: true,
      pickup_only: isPickupOnly,
      delivery_available: !isPickupOnly,
      public_location: currentUser.public_location,
      community_name: currentUser.community_name || 'Old Ottawa South',
      status: 'AVAILABLE',
      images: [selectedProduct.image_url],
      is_rescue: isRescue,
      rescue_urgent_hours: isRescue ? 24 : undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-forest-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center text-emerald-300">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">List Fresh Harvest</h2>
              <p className="text-xs text-forest-200">Broadcast your backyard surplus to Ottawa neighbors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-forest-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Harvest Listed on the Ottawa Grid!</h3>
            <p className="text-sm text-stone-600">
              Your harvest is now active on the Living Map and SwapMatch engine.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {/* Product selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Crop or Garden Product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const prod = SEED_PRODUCTS.find((p) => p.id === e.target.value);
                  if (prod) setCustomPrice(prod.base_price);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium text-stone-900 focus:ring-2 focus:ring-forest-600 focus:outline-hidden"
              >
                {SEED_PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.emoji} {prod.name_en} ({prod.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Available Quantity ({selectedProduct.default_unit})
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-900 focus:ring-2 focus:ring-forest-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Listing Type
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as ListingType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium text-stone-900 focus:ring-2 focus:ring-forest-600 focus:outline-hidden"
                >
                  <option value="SALE_OR_SWAP">Sale or Barter/Swap</option>
                  <option value="SWAP">Barter / Swap Only</option>
                  <option value="SALE">Cash Sale Only</option>
                  <option value="RESCUE">🚨 Surplus Rescue (Free)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Value Calculation Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>GrowSwap Suggested Index Value</span>
                </span>
                <span className="text-xs font-mono bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                  {priceCalc.variance_band}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="text-2xl font-bold font-mono text-emerald-800">
                  {formatCurrency(suggestedTotal)}
                </div>
                <div className="text-xs text-emerald-700 font-mono">
                  {formatCurrency(priceCalc.suggested_growswap_value)} / {selectedProduct.default_unit}
                </div>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                Calculated from Ottawa retail baseline, active neighbourhood supply, and mid-August seasonal factor.
              </p>
            </div>

            {/* Title & Notes */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Listing Title
              </label>
              <input
                type="text"
                placeholder={`${quantity} ${selectedProduct.default_unit} Fresh ${selectedProduct.name_en}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:ring-2 focus:ring-forest-600 focus:outline-hidden"
              />
            </div>

            {/* Pickup & Privacy details */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-forest-600" />
                <span>Location: {currentUser.community_name || 'Old Ottawa South'} (Obfuscated)</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPickupOnly}
                  onChange={(e) => setIsPickupOnly(e.target.checked)}
                  className="rounded text-forest-600 focus:ring-forest-500"
                />
                <span>Porch Pickup Only</span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold shadow-md hover:shadow transition-all"
              >
                Publish Harvest to Ottawa Food Grid →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
