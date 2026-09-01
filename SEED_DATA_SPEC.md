# Ottawa Demo Seed Data Specification

## Targets
- 500 simulated growers
- 1,500 active listings
- 65 products
- 2,500 plantings
- 800 wanted items
- 1,200 historical transactions
- 300 swaps
- 50 multi-party swaps
- 12 months of pricing history
- 2027 planned plantings

## Geographic distribution
Seed across:
- Centretown
- The Glebe
- Old Ottawa South
- Alta Vista
- Nepean
- Bells Corners
- Barrhaven
- Kanata
- Stittsville
- Carp
- Richmond
- Manotick
- Greely
- Osgoode
- Gloucester
- Orleans
- Cumberland

Use realistic density. Suburban/rural areas should have larger average gardens and larger quantities.

## Demo date
Support `DEMO_DATE=2026-08-24` so peak-season inventory remains visually rich regardless of real date.

## Default demo user
Name: Alex
Garden: 600 sq ft suburban Ottawa garden
Has: Roma tomatoes, zucchini, basil, cucumber
Wants: eggs, garlic, potatoes, honey

## Guaranteed 3-way swap
Alex: 10 lb tomatoes -> wants eggs
Sarah: 2 dozen eggs -> wants potatoes
David: 12 lb potatoes -> wants tomatoes
Result: 96%+ match, zero cash, visually compact Ottawa route.

## Historical data
Generate plausible seasonal pricing curves, not random noise. Increase supply and reduce reference values near peak harvest. Use lower availability during shoulder seasons.

## Inventory realism
Outdoor tomatoes should peak Jul-Sep. Garlic should be scarcer and higher-value. Zucchini should commonly show surplus. Apples should support Rescue mode in late summer/fall.
