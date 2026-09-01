# GrowSwap Pricing Engine

## UI terminology
Use **Suggested GrowSwap Value** or **Local Reference Value**. Never present as an official market price.

## Demo formula
MarketReference =
(BaseRetailBenchmark * 0.30)
+ (LocalListingMedian * 0.30)
+ (LocalCompletedTransactionMedian * 0.40)

SupplyDemandAdjustment = clamp(DemandIndex / SupplyIndex, 0.70, 1.30)

SeasonAdjustment = 0.85 to 1.20

GrowSwapValue = MarketReference * SupplyDemandAdjustment * SeasonAdjustment

## Rounding
Round to consumer-friendly denominations, e.g. $3.083 -> $3.10.

## Fair-swap bands
- 0-5% variance: Excellent Match
- 5-15%: Fair Match
- 15-30%: Flexible
- >30%: Show value difference but allow trade

## Example
10 lb tomatoes at $3.00/lb = $30 reference value.
Cabbage at $2.50/lb -> 12 lb suggested equivalent.
