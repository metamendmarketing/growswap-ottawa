'use client';

import React from 'react';
import { Garden, Planting } from '@/types';
import { formatQuantity } from '@/lib/utils';

interface BedVisualizerProps {
  garden: Garden;
  plantings: Planting[];
  onSelectPlanting?: (planting: Planting) => void;
}

export function BedVisualizer({ garden, plantings, onSelectPlanting }: BedVisualizerProps) {
  const beds = garden.beds || [];

  return (
    <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 shadow-2xl text-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <h3 className="text-lg font-bold text-white">{garden.name}</h3>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">{garden.description}</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-stone-800 rounded-lg text-emerald-400 font-semibold border border-stone-700">
            {garden.area_sqft} sq ft
          </span>
          <span className="px-3 py-1 bg-stone-800 rounded-lg text-amber-400 font-semibold border border-stone-700">
            {garden.growing_zone}
          </span>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 rounded-lg font-semibold border border-emerald-800">
            {garden.sun_exposure}
          </span>
        </div>
      </div>

      {/* Raised Bed Layout Grid */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {beds.map((bed) => {
          const bedPlantings = plantings.filter((p) => p.bed_id === bed.id);

          return (
            <div
              key={bed.id}
              className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 hover:border-forest-600 transition-all space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 className="font-bold text-sm text-white">{bed.name}</h4>
                </div>
                <span className="text-[11px] font-mono text-stone-400">
                  {bed.width}&apos; × {bed.height}&apos; ({bed.width * bed.height} sq ft)
                </span>
              </div>

              {/* Plantings inside this bed */}
              <div className="space-y-2">
                {bedPlantings.length > 0 ? (
                  bedPlantings.map((planting) => (
                    <div
                      key={planting.id}
                      onClick={() => onSelectPlanting && onSelectPlanting(planting)}
                      className="p-3 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-stone-800 flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {planting.product?.emoji || '🌱'}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-stone-100 group-hover:text-emerald-400 transition-colors">
                            {planting.product?.name_en}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {planting.plant_count} plants • {planting.area_sqft} sq ft
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-emerald-400">
                          {formatQuantity(planting.expected_surplus, planting.product?.default_unit || 'lb')} surplus
                        </div>
                        <div className="text-[10px] text-stone-500">
                          yield ~{planting.yield_expected} {planting.product?.default_unit || 'lb'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-stone-500 font-mono border border-dashed border-stone-800 rounded-xl">
                    Open Bed Space (Ready for Late Summer Greens)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
