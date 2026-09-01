import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatQuantity(qty: number, unit: string): string {
  return `${qty} ${unit}`;
}

export function getHarvestFreshnessBadge(harvestedAt?: string): {
  label: string;
  colorClass: string;
  isFresh: boolean;
} {
  if (!harvestedAt) {
    return { label: 'Harvested Today', colorClass: 'bg-emerald-100 text-emerald-800', isFresh: true };
  }

  // Demo reference date: 2026-08-24
  const harvestTime = new Date(harvestedAt).getTime();
  const demoTime = new Date('2026-08-24T12:00:00Z').getTime();
  const diffHours = Math.max(0, Math.round((demoTime - harvestTime) / (1000 * 60 * 60)));

  if (diffHours <= 6) {
    return { label: 'Picked This Morning', colorClass: 'bg-emerald-500 text-white font-medium', isFresh: true };
  } else if (diffHours <= 24) {
    return { label: 'Picked Yesterday', colorClass: 'bg-emerald-100 text-emerald-800', isFresh: true };
  } else if (diffHours <= 72) {
    return { label: `${Math.round(diffHours / 24)}d ago`, colorClass: 'bg-amber-100 text-amber-800', isFresh: false };
  } else {
    return { label: 'Well Cured / Stored', colorClass: 'bg-stone-100 text-stone-700', isFresh: false };
  }
}
