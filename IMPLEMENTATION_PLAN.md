# GrowSwap Ottawa — Implementation Plan

## Product vision
GrowSwap is a hyperlocal food network for Ottawa where residents can sell, swap, give away, or rescue excess produce, seeds, seedlings, and selected garden goods.

The long-term product is not merely a marketplace. It is a local food intelligence network that understands what is growing, what is available, what is wanted, what is scarce, and what households should consider planting next year.

## Core user roles
- Household grower
- Hobby grower
- Buyer
- Community garden member
- Small farm / pro grower
- Community admin
- Platform admin

## Core routes
- `/` — Ottawa dashboard
- `/map` — living map
- `/market` — marketplace
- `/market/[listing-id]` — listing details
- `/swap` — SwapMatch
- `/garden` — My Garden
- `/plan` — next-season planner
- `/ottawa` — Ottawa Food Grid
- `/ottawa/product/[slug]` — product intelligence
- `/community/[slug]` — local community page
- `/grower/[username]` — public grower profile
- `/messages` — conversations
- `/admin` — administration

## Signature experiences
### Ottawa is Growing
A live Ottawa map showing clusters of products and active growers. Map modes:
- Available now
- Growing
- Coming soon
- Wanted
- 2027 plans
- Supply gaps
- Surplus
- Swaps
- Community gardens

### Map time machine
Month slider from April to November plus Historical / Current / Forecast modes.

### GrowSwap Index
Dynamic suggested local value based on reference pricing, recent listings, completed exchanges, supply, demand, and seasonality.

### SwapMatch
Two-way matching plus 3-way and 4-way cycles modeled as a directed graph.

### Garden planner
Uses household goals plus local supply/demand to recommend what to plant more or less of next season.

### Surplus Rescue
Urgent mode for apples, zucchini, seedlings, and other items that need to move quickly or can be picked directly.

## MVP feature checklist
- Real Ottawa geography
- Seeded Ottawa grower network
- Profiles
- Gardens
- Produce listings
- Add Harvest wizard
- Interactive map
- Product clustering and heatmaps
- Price index and history
- I Have / I Want
- 2-way SwapMatch
- 3-way SwapMatch
- Garden yield and surplus forecast
- 2027 optimization
- Food Grid dashboard
- Harvest Drops
- Surplus Rescue
- Notifications/watchlists
- Demo reset

## Product principles
1. Never reveal exact residential locations publicly.
2. Barter fairness is advisory, never forced.
3. Marketplace density matters more than raw user count.
4. Deterministic logic owns pricing, matching, inventory, and forecasting; AI explains and assists.
5. The first demo should feel like a mature network, not an empty marketplace.
