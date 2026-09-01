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
  Menu,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Overview', icon: Activity },
    { href: '/map', label: 'Living Map', icon: Map },
    { href: '/market', label: 'Marketplace', icon: ShoppingBag },
    { href: '/swap', label: 'SwapMatch', icon: ArrowLeftRight },
    { href: '/garden', label: 'My Garden', icon: Sprout },
    { href: '/plan', label: '2027 Plan', icon: CalendarDays },
    { href: '/ottawa', label: 'Food Grid', icon: LayoutGrid },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-stone-900 flex items-center gap-1">
                  GrowSwap <span className="text-forest-600 font-semibold">Ottawa</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-600">
                  Hyperlocal Food Network
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation — Icon on Top with Text Underneath */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center py-2 px-3 xl:px-4 rounded-xl transition-all group ${
                    isActive
                      ? 'text-forest-800 bg-forest-50/90 shadow-xs font-semibold'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 font-medium'
                  }`}
                >
                  {/* Icon Container with optional badge */}
                  <div className="relative flex items-center justify-center">
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-forest-600' : 'text-stone-600 group-hover:text-stone-800'
                    }`} />
                    
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-3.5 px-1 py-0.2 text-[9px] font-bold font-mono rounded-full bg-emerald-600 text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Text Underneath */}
                  <span className={`text-[11px] mt-1.5 leading-none tracking-tight ${
                    isActive ? 'text-forest-900 font-semibold' : 'text-stone-600 group-hover:text-stone-900'
                  }`}>
                    {item.label}
                  </span>

                  {/* Active Bottom Indicator Bar */}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-forest-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons: Add Harvest & Profile */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              href="/market?action=add-harvest"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Harvest</span>
            </Link>

            <Link
              href={`/grower/${currentUser.username}`}
              className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200/90 transition-all hover:shadow-xs"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-forest-200 flex items-center justify-center border border-forest-400">
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={currentUser.display_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-forest-700" />
                )}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {currentUser.display_name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-stone-600 leading-tight font-mono">
                  {currentUser.community_name?.split(' ')[0] || 'Ottawa'}
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-4 gap-2 pb-3 border-b border-stone-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
                    isActive
                      ? 'bg-forest-50 text-forest-800 font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-forest-600' : 'text-stone-600'}`} />
                  <span className="text-[10px] mt-1 leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/market?action=add-harvest"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl bg-forest-600 text-white text-xs font-bold shadow-xs"
            >
              + Add Fresh Harvest
            </Link>
            <Link
              href={`/grower/${currentUser.username}`}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold"
            >
              My Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
