'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Garden, Listing, Planting, Profile, SwapMatch, Transaction, WantedItem } from '@/types';
import { DEMO_USER_GARDEN, DEMO_USER_PROFILE, generateSeedData } from './seed-data';
import { findSwapMatches } from '../swap-engine';

interface AppStoreContextType {
  currentUser: Profile;
  setCurrentUser: (user: Profile) => void;
  listings: Listing[];
  wants: WantedItem[];
  profiles: Profile[];
  gardens: Garden[];
  plantings: Planting[];
  transactions: Transaction[];
  demoDate: string;
  setDemoDate: (date: string) => void;
  locale: 'en' | 'fr';
  setLocale: (l: 'en' | 'fr') => void;
  addListing: (newListing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => Listing;
  addPlanting: (newPlanting: Omit<Planting, 'id' | 'created_at'>) => Planting;
  proposeSwap: (matchId: string) => boolean;
  resetDemoData: () => void;
  getSwapMatchesForCurrentUser: () => SwapMatch[];
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

const STORAGE_KEY = 'growswap_ottawa_state_v1';

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<Profile>(DEMO_USER_PROFILE);
  const [listings, setListings] = useState<Listing[]>([]);
  const [wants, setWants] = useState<WantedItem[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [gardens, setGardens] = useState<Garden[]>([DEMO_USER_GARDEN]);
  const [plantings, setPlantings] = useState<Planting[]>(DEMO_USER_GARDEN.plantings || []);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [demoDate, setDemoDate] = useState<string>('2026-08-24');
  const [locale, setLocale] = useState<'en' | 'fr'>('en');

  // Initialize store
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed.currentUser || DEMO_USER_PROFILE);
        setListings(parsed.listings || []);
        setWants(parsed.wants || []);
        setProfiles(parsed.profiles || []);
        setGardens(parsed.gardens || [DEMO_USER_GARDEN]);
        setPlantings(parsed.plantings || DEMO_USER_GARDEN.plantings || []);
        setTransactions(parsed.transactions || []);
        setDemoDate(parsed.demoDate || '2026-08-24');
        setLocale(parsed.locale || 'en');
        setIsLoaded(true);
        return;
      }
    } catch (e) {
      console.warn('Could not read from local storage, generating fresh seed data', e);
    }

    // Generate fresh seed dataset
    const seed = generateSeedData();
    setProfiles(seed.profiles);
    setListings(seed.listings);
    setWants(seed.wants);
    setGardens(seed.gardens);
    setPlantings(seed.plantings);
    setTransactions(seed.transactions);
    setIsLoaded(true);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentUser,
          listings: listings.slice(0, 300),
          wants: wants.slice(0, 200),
          profiles: profiles.slice(0, 100),
          gardens,
          plantings,
          transactions,
          demoDate,
          locale,
        })
      );
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [isLoaded, currentUser, listings, wants, profiles, gardens, plantings, transactions, demoDate, locale]);

  const addListing = (newListingData: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Listing => {
    const id = `listing-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const listing: Listing = {
      ...newListingData,
      id,
      created_at: timestamp,
      updated_at: timestamp,
    };

    setListings((prev) => [listing, ...prev]);
    return listing;
  };

  const addPlanting = (newPlantingData: Omit<Planting, 'id' | 'created_at'>): Planting => {
    const id = `plant-${Date.now()}`;
    const planting: Planting = {
      ...newPlantingData,
      id,
      created_at: new Date().toISOString(),
    };

    setPlantings((prev) => [...prev, planting]);
    return planting;
  };

  const proposeSwap = (_matchId: string): boolean => {
    return true;
  };

  const resetDemoData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    const seed = generateSeedData();
    setCurrentUser(DEMO_USER_PROFILE);
    setProfiles(seed.profiles);
    setListings(seed.listings);
    setWants(seed.wants);
    setGardens(seed.gardens);
    setPlantings(seed.plantings);
    setTransactions(seed.transactions);
    setDemoDate('2026-08-24');
    setLocale('en');
  };

  const getSwapMatchesForCurrentUser = (): SwapMatch[] => {
    return findSwapMatches({
      currentUser,
      allListings: listings,
      allWants: wants,
      allProfiles: profiles,
    });
  };

  return (
    <AppStoreContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        listings,
        wants,
        profiles,
        gardens,
        plantings,
        transactions,
        demoDate,
        setDemoDate,
        locale,
        setLocale,
        addListing,
        addPlanting,
        proposeSwap,
        resetDemoData,
        getSwapMatchesForCurrentUser,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreContextType {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}
