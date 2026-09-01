'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  Map, 
  ShoppingBag, 
  ArrowLeftRight, 
  LayoutGrid, 
  CalendarDays, 
  Activity, 
  Plus, 
  User,
  MoreHorizontal,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { AddHarvestModal } from '@/components/market/AddHarvestModal';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { currentUser } = useAppStore();
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { href: '/', label: 'Home', icon: Activity },
    { href: '/map', label: 'Map', icon: Map },
    { isAction: true, label: 'Add', icon: Plus },
    { href: '/swap', label: 'Swap', icon: ArrowLeftRight },
    { href: '/garden', label: 'Garden', icon: Sprout },
  ];

  const moreTabs = [
    { href: '/market', label: 'Marketplace', icon: ShoppingBag, desc: 'Buy, barter, and rescue produce' },
    { href: '/plan', label: '2027 Season Planner', icon: CalendarDays, desc: 'Crop demand optimizer' },
    { href: '/ottawa', label: 'Ottawa Food Grid', icon: LayoutGrid, desc: 'Citywide shortage heatmaps' },
    { href: `/grower/${currentUser.username}`, label: 'My Grower Profile', icon: User, desc: 'View your public profile' },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation for Mobile Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          {mainTabs.map((tab, idx) => {
            const Icon = tab.icon;

            if (tab.isAction) {
              return (
                <button
                  key="add-harvest-btn"
                  onClick={() => setIsAddHarvestOpen(true)}
                  className="flex flex-col items-center justify-center -mt-5 group focus:outline-hidden"
                  aria-label="Add Harvest"
                >
                  <div className="w-13 h-13 rounded-full bg-gradient-to-br from-forest-600 to-forest-800 text-white flex items-center justify-center shadow-lg shadow-forest-700/30 group-active:scale-95 transition-transform border-4 border-white">
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 mt-1">Add</span>
                </button>
              );
            }

            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href!}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-95 ${
                  isActive ? 'text-forest-700 font-bold' : 'text-stone-500 hover:text-stone-900 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-forest-600' : 'text-stone-500'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-forest-600" />
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight leading-none">{tab.label}</span>
              </Link>
            );
          })}

          {/* More menu button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl text-stone-500 hover:text-stone-900 font-medium active:scale-95"
          >
            <MoreHorizontal className="w-5 h-5 text-stone-500" />
            <span className="text-[10px] mt-1 tracking-tight leading-none">More</span>
          </button>
        </div>
      </div>

      {/* "More" Bottom Sheet Drawer for Mobile */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900">GrowSwap Navigation</h3>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {moreTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-forest-50 border-forest-300 text-forest-900'
                        : 'bg-stone-50 border-stone-200/80 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-forest-600 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{tab.label}</div>
                      <div className="text-[11px] text-stone-500">{tab.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Harvest Modal */}
      <AddHarvestModal
        isOpen={isAddHarvestOpen}
        onClose={() => setIsAddHarvestOpen(false)}
      />
    </>
  );
}
