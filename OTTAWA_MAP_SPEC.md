# Ottawa Map & Geo Specification

## Map modes
- Available Now
- Growing
- Coming Soon
- Wanted
- 2027 Plans
- Supply Gaps
- Surplus
- Swaps
- Community Gardens

## Visual behavior
- Cluster at low zoom
- Split into product icons at neighbourhood zoom
- Show approximate grower points only at closer zoom
- Never expose exact residential addresses publicly
- Animated radius circle for 1/2/5/10/25/50 km search
- Heatmap mode for supply and supply gaps
- Animated curves for multi-party swaps

## Time controls
Month slider: APR -> NOV
Modes: Historical / Current / Forecast

## Privacy
Store actual location separately from public location.
Generate public coordinates by offsetting or snapping to a 250-500m privacy cell for urban/suburban users and 500-1000m for sparse rural locations.

## Ottawa GIS integration
Create import scripts for:
- City ward polygons
- Ottawa community garden locations
- Optional neighbourhood polygons if a suitable public dataset is available

Normalize all imported shapes to EPSG:4326.
