# GrowSwap Ottawa

Antigravity-ready implementation package for a hyperlocal food exchange network focused on Ottawa, Ontario.

## Core idea
GrowSwap lets household gardeners, hobby growers, community gardeners, and small farms sell, swap, give away, or rescue local produce. The differentiator is the network intelligence layer: live supply/demand, local pricing, harvest forecasting, multi-party swaps, and next-season garden planning.

## Recommended stack
- Next.js + TypeScript
- Tailwind CSS
- Supabase Postgres + PostGIS + Auth + Realtime + Storage
- Vercel
- Mapbox GL JS or MapLibre
- Recharts
- OpenAI/Gemini provider abstraction for explanations/planning only

## Build order
1. Foundation + auth + profiles
2. Marketplace + Add Harvest
3. Living Ottawa map
4. GrowSwap pricing index
5. Two-way + multi-way swap engine
6. Garden + harvest forecasting
7. 2027 planner
8. Community + notifications
9. Production hardening

## Demo mode
Use seeded Ottawa data so the application looks alive immediately. The default demo user must always have strong 2-way and 3-way swap matches.

See the other files in this package for detailed requirements.
