'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  Map, 
  ShoppingBag, 
  RefreshCw, 
  LayoutGrid, 
  CalendarDays, 
  Activity, 
  Settings, 
  Plus, 
  Globe,
  User
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, locale, setLocale, demoDate } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Overview', icon: Activity },
    { href: '/map', label: 'Living Map', icon: Map },
    { href: '/market', label: 'Marketplace', icon: ShoppingBag },
    { href: '/swap', label: 'SwapMatch', icon: RefreshCw, badge: '3-Way Loop' },
    { href: '/garden', label: 'My Garden', icon: Sprout },
    { href: '/plan', label: '2027 Planner', icon: CalendarDays },
    { href: '/ottawa', label: 'Food Grid', icon: LayoutGrid },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top micro-bar for Demo status */}
      <div className="bg-forest-900 text-forest-100 text-xs py-1 px-4 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OTTAWA HYPERLOCAL FOOD NETWORK</span>
          <span className="hidden sm:inline text-forest-300">•</span>
          <span className="hidden sm:inline text-forest-300">DEMO DATE: {demoDate} (PEAK HARVEST)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            <span>{locale.toUpperCase()}</span>
          </button>
          <Link href="/admin" className="text-forest-300 hover:text-white flex items-center gap-1">
            <Settings className="w-3 h-3" />
            <span className="hidden md:inline">Admin</span>
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-stone-900 flex items-center gap-1">
                  GrowSwap <span className="text-forest-600 font-semibold">Ottawa</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-600">
                  Local Food Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-forest-800 bg-forest-50/80 shadow-xs border border-forest-200/50'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-forest-600' : 'text-stone-600'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-600 text-white tracking-wide">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action & User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/market?action=add-harvest"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-forest-600 hover:bg-forest-700 text-white text-sm font-medium shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Harvest</span>
            </Link>

            <Link
              href={`/grower/${currentUser.username}`}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-forest-200 flex items-center justify-center">
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={currentUser.display_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-forest-700" />
                )}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-stone-900 leading-tight">{currentUser.display_name.split(' ')[0]}</div>
                <div className="text-[10px] text-stone-600 leading-tight">{currentUser.community_name || 'Ottawa'}</div>
              </div>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              <LayoutGrid className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-forest-50 text-forest-800' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-stone-100 flex gap-2">
            <Link
              href="/market?action=add-harvest"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 rounded-lg bg-forest-600 text-white text-sm font-medium"
            >
              Add Harvest
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
