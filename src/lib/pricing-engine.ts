import { Product } from '@/types';

export interface PriceCalculationResult {
  product_id: string;
  market_reference: number;
  base_benchmark: number;
  listing_median: number;
  transaction_median: number;
  supply_index: number;
  demand_index: number;
  supply_demand_factor: number;
  season_factor: number;
  suggested_growswap_value: number;
  variance_band: 'EXCELLENT' | 'FAIR' | 'FLEXIBLE' | 'ASYMMETRIC';
}

/**
 * Calculates dynamic Suggested GrowSwap Value according to PRICING_ENGINE.md specification:
 * MarketReference = (BaseRetailBenchmark * 0.30) + (LocalListingMedian * 0.30) + (LocalCompletedTransactionMedian * 0.40)
 * SupplyDemandAdjustment = clamp(DemandIndex / SupplyIndex, 0.70, 1.30)
 * SeasonAdjustment = 0.85 to 1.20
 * GrowSwapValue = MarketReference * SupplyDemandAdjustment * SeasonAdjustment
 */
export function calculateGrowSwapValue(
  product: Product,
  options: {
    listingMedian?: number;
    transactionMedian?: number;
    supplyIndex?: number;
    demandIndex?: number;
    month?: number; // 1-12
  } = {}
): PriceCalculationResult {
  const baseBenchmark = product.base_price || 3.00;
  const listingMedian = options.listingMedian ?? baseBenchmark * 0.95;
  const transactionMedian = options.transactionMedian ?? baseBenchmark * 0.90;

  const marketReference =
    baseBenchmark * 0.30 +
    listingMedian * 0.30 +
    transactionMedian * 0.40;

  const supply = Math.max(options.supplyIndex ?? 1.0, 0.1);
  const demand = Math.max(options.demandIndex ?? 1.0, 0.1);
  const rawRatio = demand / supply;
  const supplyDemandFactor = Math.min(Math.max(rawRatio, 0.70), 1.30);

  // Seasonality adjustment
  const month = options.month ?? 8; // August default
  let seasonFactor = 1.0;
  if (product.season_peak && month === product.season_peak) {
    // Peak season -> abundant supply, slight downward price adjustment
    seasonFactor = 0.88;
  } else if (product.season_start && (month < product.season_start || month > (product.season_end || 11))) {
    // Shoulder or out-of-season -> higher value
    seasonFactor = 1.20;
  } else if (product.season_start && month === product.season_start) {
    // Early harvest premium
    seasonFactor = 1.10;
  }

  const rawValue = marketReference * supplyDemandFactor * seasonFactor;
  // Round to nearest 5 cents / $0.05
  const suggestedGrowswapValue = Math.round(rawValue * 20) / 20;

  return {
    product_id: product.id,
    market_reference: Math.round(marketReference * 100) / 100,
    base_benchmark: baseBenchmark,
    listing_median: Math.round(listingMedian * 100) / 100,
    transaction_median: Math.round(transactionMedian * 100) / 100,
    supply_index: Math.round(supply * 100) / 100,
    demand_index: Math.round(demand * 100) / 100,
    supply_demand_factor: Math.round(supplyDemandFactor * 100) / 100,
    season_factor: Math.round(seasonFactor * 100) / 100,
    suggested_growswap_value: suggestedGrowswapValue,
    variance_band: 'EXCELLENT',
  };
}

/**
 * Assesses fair swap balance between two side values
 */
export function evaluateSwapFairness(valueA: number, valueB: number): {
  rating: 'EXCELLENT' | 'FAIR' | 'FLEXIBLE' | 'ASYMMETRIC';
  variancePercent: number;
  labelEn: string;
  labelFr: string;
  colorClass: string;
} {
  if (valueA <= 0 || valueB <= 0) {
    return {
      rating: 'FLEXIBLE',
      variancePercent: 0,
      labelEn: 'Flexible Match',
      labelFr: 'Échange flexible',
      colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
    };
  }

  const maxVal = Math.max(valueA, valueB);
  const minVal = Math.min(valueA, valueB);
  const variancePercent = Math.round(((maxVal - minVal) / maxVal) * 100);

  if (variancePercent <= 5) {
    return {
      rating: 'EXCELLENT',
      variancePercent,
      labelEn: 'Excellent Match (0–5%)',
      labelFr: 'Accord excellent (0–5 %)',
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  } else if (variancePercent <= 15) {
    return {
      rating: 'FAIR',
      variancePercent,
      labelEn: 'Fair Match (5–15%)',
      labelFr: 'Accord équitable (5–15 %)',
      colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
    };
  } else if (variancePercent <= 30) {
    return {
      rating: 'FLEXIBLE',
      variancePercent,
      labelEn: 'Flexible Match (15–30%)',
      labelFr: 'Accord flexible (15–30 %)',
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  } else {
    return {
      rating: 'ASYMMETRIC',
      variancePercent,
      labelEn: 'Value Variance (>30%)',
      labelFr: 'Écart de valeur (>30 %)',
      colorClass: 'text-stone-700 bg-stone-100 border-stone-300',
    };
  }
}
